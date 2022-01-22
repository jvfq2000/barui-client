import Router from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import {
  Flex,
  VStack,
  Box,
  Divider,
  Link,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import { Button } from "../../components/form/Button";
import { Input } from "../../components/form/Input";
import { Logo } from "../../components/Header/Logo";
import { api } from "../../services/apiClient";
import { withSSRGuest } from "../../shared/withSSRGuest";

interface IResetPasswordFormData {
  token: string;
  password: string;
  passwordConfirmation: string;
}

const resetPasswordFormSchema = yup.object().shape({
  token: yup.string().required("Token obrigatório"),
  password: yup
    .string()
    .required("Senha obrigatória")
    .min(6, "No mínimo 6 caracteres"),
  passwordConfirmation: yup
    .string()
    .oneOf([null, yup.ref("password")], "As senhas precisam ser iguais"),
});

export default function ResetPassword(): JSX.Element {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(resetPasswordFormSchema),
  });
  const { errors } = formState;

  const { colorMode } = useColorMode();

  const toast = useToast();

  const handleResetPassword: SubmitHandler<
    IResetPasswordFormData
  > = async data => {
    const { token, password } = data;
    api
      .post(`password/reset?token=${token}`, {
        password,
      })
      .then(() => {
        toast({
          description: "Senha alterada com sucesso.",
          status: "success",
          position: "top",
          duration: 8000,
          isClosable: true,
        });

        Router.push("/");
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
  };

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        w="100%"
        maxW={[304, 400]}
        bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleResetPassword)}
      >
        <Box align="center">
          <Logo />

          <VStack spacing="4" mt="6">
            <Input
              name="token"
              label="Token"
              error={errors.token}
              {...register("token")}
            />
            <Input
              name="password"
              type="password"
              label="Senha"
              error={errors.password}
              {...register("password")}
            />
            <Input
              name="passwordConfirmation"
              type="password"
              label="Confirmação da senha"
              error={errors.passwordConfirmation}
              {...register("passwordConfirmation")}
            />
          </VStack>

          <Button
            label="Alterar senha"
            type="submit"
            mt="6"
            colorScheme="green"
            size="lg"
            w="100%"
            isLoading={formState.isSubmitting}
          />

          <Divider mt="8" />

          <Flex mt="6" justify="center">
            <Link href="/password/forgot">Voltar</Link>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

const getServerSideProps = withSSRGuest(async ctx => {
  return {
    props: {},
  };
});

export { getServerSideProps };
