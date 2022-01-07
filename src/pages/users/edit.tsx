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
import { Select } from "../../components/form/Select";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

interface IEditUserFormData {
  name: string;
  email: string;
  accessLevel: string;
  identifier: string;
}

const editUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  lastName: yup.string().required("Sobrenome obrigatório"),
  accessLevel: yup.string().required("Nível de acesso obrigatório"),
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
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
        const { name, lastName, email, accessLevel } = response.data;

        setValue("name", name);
        setValue("lastName", lastName);
        setValue("email", email);
        setValue("accessLevel", accessLevel);
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
              <Input
                name="email"
                type="email"
                label="E-mail"
                error={errors.email}
                {...register("email")}
              />
              <Select
                name="accessLevel"
                placeholder="Selecione"
                options={[
                  { value: "cliente", label: "Cliente" },
                  { value: "profissional", label: "Profissional" },
                  { value: "representante", label: "Representante" },
                  { value: "administrador", label: "Administrador" },
                ]}
                label="Nível de acesso"
                error={errors.accessLevel}
                {...register("accessLevel")}
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
