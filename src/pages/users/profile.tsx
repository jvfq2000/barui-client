import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import * as yup from "yup";

import {
  Box,
  Flex,
  Heading,
  Button,
  Divider,
  VStack,
  SimpleGrid,
  Avatar,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import { Input } from "../../components/form/Input";
import { InputFile } from "../../components/form/InputFile";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { IUser } from "../../services/hooks/useUsers";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { IShowToast } from "../../utils/iShowToast";
import { accessLevel } from "../../utils/permitions";
import { uploadFile } from "../../utils/uploadFile";

interface IEditProfileFormData {
  name: string;
  lastName: string;
  email: string;
  identifier: string;
  accessLevel: string;
}

const profileUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  lastName: yup.string().required("Sobrenome obrigatório"),
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  identifier: yup
    .string()
    .required("CPF obrigatório")
    .min(14, "CPF incompleto"),
  accessLevel: yup.string().required("Nível de acesso obrigatório"),
});

export default function ProfileUser(): JSX.Element {
  const [avatar, setAvatar] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUpload, setAvatarUpload] = useState<File>(null);
  const [isLoadingUploadAvatar, setIsLoadingUploadAvatar] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  const { register, formState, setValue, getValues } = useForm({
    resolver: yupResolver(profileUserFormSchema),
  });
  const { errors } = formState;

  const { data, isLoading, isFetching, error, refetch } = useQuery(
    "profile",
    async (): Promise<IUser> => {
      const { data } = await api.get("users/profile");
      return data;
    },
    {
      staleTime: 1000 * 60 * 5,
    },
  );

  useEffect(() => {
    setValue("name", data?.name);
    setValue("lastName", data?.lastName);
    setValue("email", data?.email);
    setValue("identifier", data?.identifier);
    setValue("accessLevel", data?.accessLevel);
    setAvatar(data?.avatar);
    setAvatarUrl(data?.avatarUrl);
  }, [data]);

  function showToast({ description, status }: IShowToast) {
    window.location.reload();
  }

  const handleChangeAvatar = event => {
    const avatar = event.target.files[0];
    setAvatarUpload(avatar);
    setFileSelected(true);
  };

  function handleUploadAvatar() {
    setIsLoadingUploadAvatar(true);
    uploadFile({
      url: "users/avatar",
      file: avatarUpload,
      nameFileRequest: "avatar",
      descriptionToast: "Avatar alterado com sucesso.",
      showToast,
      updateData: refetch,
    });
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px={[4, 6]}>
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">
            Perfil
            {!isLoading && isFetching && (
              <Spinner size="sm" color="gray.500" ml="4" />
            )}
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          {
            // eslint-disable-next-line no-nested-ternary
            isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex>
                <Text>Falha ao obter dados dos usuários.</Text>
              </Flex>
            ) : (
              <VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                  <Box align="center">
                    {" "}
                    <Avatar
                      mr="4"
                      size="xl"
                      name={getValues("name")}
                      src={avatar && avatarUrl}
                    />
                  </Box>
                  <Box position="relative" top="30%">
                    <InputFile
                      name="avatar"
                      label={avatarUpload?.name || "Alterar avatar"}
                      pt="1"
                      error={errors.avatar}
                      {...register("avatar")}
                      onChange={handleChangeAvatar}
                      showButtonUpload
                      handleButtonUpload={handleUploadAvatar}
                      labelBotton="Alterar"
                      isLoadingButton={isLoadingUploadAvatar}
                      fileSelected={fileSelected}
                    />
                  </Box>
                </SimpleGrid>

                <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                  <Input
                    isDisabled={true}
                    name="name"
                    label="Nome"
                    error={errors.name}
                    {...register("name")}
                  />
                  <Input
                    isDisabled={true}
                    name="lastName"
                    label="Sobrenome"
                    error={errors.lastName}
                    {...register("lastName")}
                  />
                </SimpleGrid>

                <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
                  <Input
                    isDisabled={true}
                    name="email"
                    type="email"
                    label="E-mail"
                    error={errors.email}
                    {...register("email")}
                  />
                  <Input
                    isDisabled={true}
                    name="identifier"
                    label="CPF"
                    error={errors.identifier}
                    {...register("identifier")}
                  />
                  <Input
                    isDisabled={true}
                    name="accessLevel"
                    label="Nível de acesso"
                    error={errors.accessLevel}
                    {...register("accessLevel")}
                  />
                </SimpleGrid>
              </VStack>
            )
          }

          <Divider my="6" borderColor="gray.700" />

          <Flex justify="right">
            <Link href="/users" passHref>
              <Button colorScheme="whiteAlpha"> Voltar </Button>
            </Link>
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
}, accessLevel[0]);

export { getServerSideProps };
