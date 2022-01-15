import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";

import {
  Box,
  Flex,
  Heading,
  Button,
  Divider,
  VStack,
  SimpleGrid,
  HStack,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import { Input } from "../../components/form/Input";
import { ISelectOption, Select } from "../../components/form/Select";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { IInstitution } from "../../services/hooks/useInstitutions";
import { queryClient } from "../../services/queryClient";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

interface IEditInstitutionFormData {
  name: string;
  cityId: string;
}

interface ICity {
  id: string;
  name: string;
}

interface IState {
  id: string;
  name: string;
  acronym: string;
}

const editInstitutionFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  cityId: yup.string().required("Cidade obrigatória"),
});

export default function EditInstitution(): JSX.Element {
  const { id } = Router.query;
  const toast = useToast();

  const [stateId, setStateId] = useState("");
  const [cities, setCities] = useState<ICity[]>();
  const [states, setStates] = useState<IState[]>();

  useEffect(() => {
    api
      .get(`states`)
      .then(response => {
        const states = response.data as IState[];

        setStates(states);
      })
      .catch(error => {
        toast({
          title: "Ops!",
          description: error.response.data.message,
          status: "error",
          position: "top",
          duration: 8000,
          isClosable: true,
        });
      });
  }, []);

  const { data, isLoading } = useQuery(
    ["cities", stateId],
    async (): Promise<ICity[]> => {
      const { data } = await api.get(`cities?stateId=${stateId}`);
      return data;
    },
    {
      staleTime: 1000 * 60 * 60,
    },
  );

  useEffect(() => {
    setCities(data);
  }, [data]);

  const editInstitution = useMutation(
    async (institution: IEditInstitutionFormData) => {
      api
        .put(`institutions?institutionId=${id}`, institution)
        .then(response => {
          toast({
            description: "Campus alterado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          Router.push("/institutions");
          return response.data.institution;
        })
        .catch(error => {
          toast({
            description: error.response.data.message,
            status: "error",
            position: "top",
            duration: 8000,
            isClosable: true,
          });
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("institutions");
      },
    },
  );

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(editInstitutionFormSchema),
  });
  const { errors } = formState;

  useEffect(() => {
    api
      .get(`institutions/by-id?institutionId=${id}`)
      .then(response => {
        const { name, cityId, stateId } = response.data as IInstitution;

        setValue("name", name);
        setStateId(stateId);
        setValue("cityId", cityId);
      })
      .catch(error => {
        toast({
          title: "Ops!",
          description: error.response.data.message,
          status: "error",
          position: "top",
          duration: 8000,
          isClosable: true,
        });
      });
  }, [states]);

  const handleEditInstitution: SubmitHandler<
    IEditInstitutionFormData
  > = async data => {
    await editInstitution.mutateAsync(data);
  };

  function generateOptionsStates(): ISelectOption[] {
    const options: ISelectOption[] = [];

    if (states) {
      states.forEach(state => {
        options.push({
          value: state.id,
          label: `${state.name} - ${state.acronym}`,
        });
      });
    }

    return options;
  }

  function generateOptionsCities(): ISelectOption[] {
    const options: ISelectOption[] = [];

    if (cities) {
      cities.forEach(citie => {
        options.push({
          value: citie.id,
          label: citie.name,
        });
      });
    }

    return options;
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px={[4, 6]}>
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleEditInstitution)}
        >
          <Heading size="lg" fontWeight="normal">
            Cadastar campus
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="name"
                label="Nome"
                error={errors.name}
                {...register("name")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Select
                name="states"
                placeholder="Selecione"
                options={generateOptionsStates()}
                label="Estado"
                onChange={event => {
                  setStateId(event.target.value);
                }}
                value={stateId}
              />

              <Select
                name="cities"
                placeholder={isLoading ? "Buscando cidades ..." : "Selecione"}
                options={generateOptionsCities()}
                label="Cidade"
                error={errors.cityId}
                {...register("cityId")}
                isDisabled={isLoading}
              />
            </SimpleGrid>
          </VStack>

          <Divider my="6" borderColor="gray.700" />

          <SimpleGrid flex="1" gap="4" minChildWidth={120} align="flex-start">
            <Link href="/institutions" passHref>
              <Button
                colorScheme="whiteAlpha"
                leftIcon={<Icon as={RiCloseCircleLine} fontSize="20" />}
              >
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              colorScheme="green"
              isLoading={formState.isSubmitting}
              leftIcon={<Icon as={RiCheckboxCircleLine} fontSize="20" />}
            >
              Alterar
            </Button>
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
}

const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
}, accessLevel[4]);

export { getServerSideProps };
