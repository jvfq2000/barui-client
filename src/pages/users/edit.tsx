import Link from "next/link";
import Router from "next/router";
import { useEffect } from "react";
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
  VStack,
  SimpleGrid,
  HStack,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import { Input } from "../../components/form/Input";
import { InputMask } from "../../components/form/InputMask";
import { Select } from "../../components/form/Select";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

interface IEditUserFormData {
  name: string;
  lastName: string;
  email: string;
  identifier: string;
  telephone: string;
  initialSemester: string;
  registration: string;
  accessLevel: string;
  courseId: string;
  institutionId: string;
}

const editUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  lastName: yup.string().required("Sobrenome obrigatório"),
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  identifier: yup
    .string()
    .required("CPF obrigatório")
    .min(14, "CPF incompleto"),
  telephone: yup.string(),
  initialSemester: yup.string().required("Semestre início curso obrigatório"),
  registration: yup.string().required("Matrícula obrigatório"),
  accessLevel: yup.string().required("Nível de acesso obrigatório"),
  institutionId: yup.string().required("Campus obrigatório"),
  courseId: yup.string().required("Curso obrigatório"),
});

export default function EditUser(): JSX.Element {
  const { id } = Router.query;
  const toast = useToast();

  const editUser = useMutation(
    async (user: IEditUserFormData) => {
      api
        .put(`users?userId=${id}`, user)
        .then(response => {
          toast({
            description: "Usuário alterado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          Router.push("/users");
          return response.data.user;
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
        queryClient.invalidateQueries("users");
      },
    },
  );

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(editUserFormSchema),
  });
  const { errors } = formState;

  useEffect(() => {
    api
      .get(`users/by-id?userId=${id}`)
      .then(response => {
        const {
          name,
          lastName,
          email,
          identifier,
          telephone,
          initialSemester,
          registration,
          accessLevel,
          courseId,
        } = response.data;

        setValue("name", name);
        setValue("lastName", lastName);
        setValue("email", email);
        setValue("identifier", identifier);
        setValue("telephone", telephone);
        setValue("initialSemester", initialSemester);
        setValue("registration", registration);
        setValue("accessLevel", accessLevel);
        setValue("courseId", courseId);
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

  const handleEditUser: SubmitHandler<IEditUserFormData> = async data => {
    await editUser.mutateAsync(data);
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
          onSubmit={handleSubmit(handleEditUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Alterar usuário
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Select
                name="accessLevel"
                placeholder="Selecione"
                options={[
                  { value: accessLevel[0], label: "Aluno" },
                  { value: accessLevel[1], label: "Coordenador de Atividades" },
                  { value: accessLevel[2], label: "Coordenador de curso" },
                  { value: accessLevel[3], label: "Administrador do campus" },
                  { value: accessLevel[4], label: "Administrador geral" },
                ]}
                label="Nível de acesso"
                error={errors.accessLevel}
                {...register("accessLevel")}
              />
              <Input
                name="name"
                label="Nome"
                error={errors.name}
                {...register("name")}
              />
              <Input
                name="lastName"
                label="Sobrenome"
                error={errors.lastName}
                {...register("lastName")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <InputMask
                mask="***.***.***-**"
                placeholder="999.999.999-99"
                maskChar="_"
                name="identifier"
                label="CPF"
                error={errors.identifier}
                {...register("identifier")}
              />
              <Input
                name="email"
                type="email"
                label="E-mail"
                error={errors.email}
                {...register("email")}
              />
              <InputMask
                mask="(**) * **** - ****"
                placeholder="(38) 9 9999 - 9999"
                maskChar="_"
                name="telephone"
                label="Telefone"
                error={errors.telephone}
                {...register("telephone")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Select
                name="institution"
                placeholder="Selecione"
                options={[
                  { value: "asdfasfasfsdf", label: "Campus 1" },
                  { value: "asdfasdfasdfsf", label: "Campus 2" },
                ]}
                label="Campus"
                error={errors.institutionId}
                {...register("institutionId")}
              />
              <Select
                name="course"
                placeholder="Selecione"
                options={[
                  { value: "asdfasfasfsdf", label: "Curso 1" },
                  { value: "asdfasdfasdfsf", label: "Curso 2" },
                ]}
                label="Curso"
                error={errors.courseId}
                {...register("courseId")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="registration"
                label="Matrícula"
                error={errors.registration}
                {...register("registration")}
              />
              <InputMask
                mask="**/****"
                placeholder="01/2022"
                maskChar="_"
                name="initialSemester"
                label="Primeiro semestre"
                error={errors.initialSemester}
                {...register("initialSemester")}
              />
            </SimpleGrid>
          </VStack>

          <Divider my="6" borderColor="gray.700" />

          <Flex>
            <HStack w="100%" justify="space-between">
              <Link href="/users" passHref>
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
