import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RiArrowGoBackLine } from "react-icons/ri";
import * as yup from "yup";

import {
  Box,
  Flex,
  Heading,
  Divider,
  VStack,
  SimpleGrid,
  Avatar,
  useToast,
  Icon,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "../../components/form/Button";
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
  name: yup.string(),
  lastName: yup.string(),
  email: yup.string(),
  identifier: yup.string(),
  telephone: yup.string(),
  accessLevel: yup.string(),
  institution: yup.string(),
  course: yup.string(),
  initialSemester: yup.string(),
  registration: yup.string(),
});

export default function ProfileUser(): JSX.Element {
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [avatar, setAvatar] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUpload, setAvatarUpload] = useState<File>(null);
  const [isLoadingUploadAvatar, setIsLoadingUploadAvatar] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  const { register, formState, setValue, getValues } = useForm({
    resolver: yupResolver(profileUserFormSchema),
  });
  const { errors } = formState;

  useEffect(() => {
    api
      .get("users/profile")
      .then(response => {
        const {
          avatar,
          avatarUrl,
          name,
          lastName,
          email,
          identifier,
          telephone,
          accessLevel,
          institutionName,
          courseName,
          initialSemester,
          registration,
        } = response.data as IUser;

        setValue("name", name);
        setValue("lastName", lastName);
        setValue("email", email);
        setValue("identifier", identifier);
        setValue("telephone", telephone);
        setValue("accessLevel", accessLevel);
        setValue("institution", institutionName);
        setValue("course", courseName);
        setValue("initialSemester", initialSemester);
        setValue("registration", registration);
        setAvatar(avatar);
        setAvatarUrl(avatarUrl);
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
  }, []);

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
      updateData: () => {
        //
      },
    });
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px={[4, 6]}>
        <Sidebar />

        <Box
          flex="1"
          borderRadius={8}
          bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
          p={["6", "8"]}
        >
          <Heading size="lg" fontWeight="normal">
            Perfil
          </Heading>

          <Divider my="6" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Box>
                <Center>
                  <Avatar
                    mb="4"
                    size="2xl"
                    name={getValues("name")}
                    src={avatar && avatarUrl}
                  />
                </Center>

                <Center>
                  <Box maxW="800px">
                    <InputFile
                      name="avatar"
                      label={avatarUpload?.name || "Alterar avatar"}
                      pt="1"
                      accept="image/*"
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
                </Center>
              </Box>
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                isDisabled={true}
                name="accessLevel"
                label="N??vel de acesso"
                error={errors.accessLevel}
                {...register("accessLevel")}
              />
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
                name="identifier"
                label="CPF"
                error={errors.identifier}
                {...register("identifier")}
              />
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
                name="telephone"
                label="Telefone"
                error={errors.telephone}
                {...register("telephone")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                isDisabled={true}
                name="institution"
                label="Campus"
                error={errors.institution}
                {...register("institution")}
              />
              <Input
                isDisabled={true}
                name="course"
                label="Curso"
                error={errors.course}
                {...register("course")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                isDisabled={true}
                name="registration"
                label="Matr??cula"
                error={errors.registration}
                {...register("registration")}
              />
              <Input
                isDisabled={true}
                name="initialSemester"
                label="Primeiro semestre"
                error={errors.initialSemester}
                {...register("initialSemester")}
              />
            </SimpleGrid>
          </VStack>

          <Divider my="6" />

          <SimpleGrid flex="1" gap="4" minChildWidth={100}>
            <Link href="/dashboard" passHref>
              <Button
                label="Voltar"
                colorScheme={colorMode === "light" ? "grayLight" : "grayDark"}
                leftIcon={<Icon as={RiArrowGoBackLine} />}
              />
            </Link>
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
}, accessLevel[0]);

export { getServerSideProps };
