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
  HStack,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import { Input } from "../../components/form/Input";
import { Select } from "../../components/form/Select";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

interface ICreateCourseFormData {
  name: string;
  numberPeriods: number;
}

const createCourseFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  numberPeriods: yup.string().required("Duração obrigatória"),
});

export default function CreateCourse(): JSX.Element {
  const toast = useToast();

  const createCourse = useMutation(
    async (course: ICreateCourseFormData) => {
      api
        .post("courses", course)
        .then(response => {
          toast({
            description: "Curso cadastrado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          Router.push("/courses");
          return response.data.course;
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
        queryClient.invalidateQueries("courses");
      },
    },
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createCourseFormSchema),
  });

  const { errors } = formState;

  const handleCreateCourse: SubmitHandler<
    ICreateCourseFormData
  > = async data => {
    await createCourse.mutateAsync(data);
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
          onSubmit={handleSubmit(handleCreateCourse)}
        >
          <Heading size="lg" fontWeight="normal">
            Cadastar curso
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
            <Input
              name="name"
              label="Nome"
              error={errors.name}
              {...register("name")}
            />

            <Select
              name="numberPeriods"
              placeholder="Selecione"
              options={[
                { value: "1", label: "1 semestre" },
                { value: "2", label: "2 semestres" },
                { value: "3", label: "3 semestres" },
                { value: "4", label: "4 semestres" },
                { value: "5", label: "5 semestres" },
                { value: "6", label: "6 semestres" },
                { value: "7", label: "7 semestres" },
                { value: "8", label: "8 semestres" },
                { value: "9", label: "9 semestres" },
                { value: "10", label: "10 semestres" },
                { value: "11", label: "11 semestres" },
                { value: "12", label: "12 semestres" },
                { value: "13", label: "13 semestres" },
                { value: "14", label: "14 semestres" },
                { value: "15", label: "15 semestres" },
                { value: "16", label: "16 semestres" },
                { value: "17", label: "17 semestres" },
                { value: "18", label: "18 semestres" },
                { value: "19", label: "19 semestres" },
                { value: "20", label: "20 semestres" },
              ]}
              label="Duração"
              error={errors.numberPeriods}
              {...register("numberPeriods")}
            />
          </SimpleGrid>

          <Divider my="6" borderColor="gray.700" />

          <Flex>
            <HStack w="100%" justify="space-between">
              <Link href="/courses" passHref>
                <Button
                  colorScheme="whigreenpha"
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
            </HStack>
          </Flex>
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
