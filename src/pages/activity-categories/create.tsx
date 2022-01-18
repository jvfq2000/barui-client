import Link from "next/link";
import Router from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";
import { useMutation } from "react-query";
import * as yup from "yup";

import {
  Box,
  Flex,
  Heading,
  Button,
  Divider,
  SimpleGrid,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import { Input } from "../../components/form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

interface ICreateActivityCategoryFormData {
  name: string;
}

const createActivityCategoryFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
});

export default function CreateActivityCategory(): JSX.Element {
  const toast = useToast();

  const createActivityCategory = useMutation(
    async (activityCategory: ICreateActivityCategoryFormData) => {
      api
        .post("activity-categories", activityCategory)
        .then(response => {
          toast({
            description: "Categoria cadastrada com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          Router.push("/activity-categories");
          return response.data.activityCategory;
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
        queryClient.invalidateQueries("activityCategories");
      },
    },
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createActivityCategoryFormSchema),
  });

  const { errors } = formState;

  const handleCreateActivityCategory: SubmitHandler<
    ICreateActivityCategoryFormData
  > = async data => {
    await createActivityCategory.mutateAsync(data);
  };

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
          onSubmit={handleSubmit(handleCreateActivityCategory)}
        >
          <Heading size="lg" fontWeight="normal">
            Cadastar categoria
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
            <Input
              name="name"
              label="Nome"
              error={errors.name}
              {...register("name")}
            />
          </SimpleGrid>

          <Divider my="6" borderColor="gray.700" />

          <SimpleGrid flex="1" gap="4" minChildWidth={100} align="flex-start">
            <Link href="/activity-categories" passHref>
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
              Cadastrar
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
}, accessLevel[3]);

export { getServerSideProps };
