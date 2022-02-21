import Router from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import {
  Flex,
  Box,
  Divider,
  Link,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "../../components/form/Button";
import { Input } from "../../components/form/Input";
import { Logo } from "../../components/Header/Logo";
import { api } from "../../services/apiClient";
import { withSSRGuest } from "../../shared/withSSRGuest";

interface IForgotPasswordFormData {
  email: string;
}

const forgotPasswordFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
});

export default function ForgotPassword(): JSX.Element {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(forgotPasswordFormSchema),
  });
  const { errors } = formState;

  const { colorMode } = useColorMode();

  const toast = useToast();

  const handleForgotPassword: SubmitHandler<
    IForgotPasswordFormData
  > = async data => {
    api
      .post("password/forgot", data)
      .then(() => {
        toast({
          description: "Verifique seu e-mail, lá tem um segredinho só nosso.",
          status: "success",
          position: "top",
          duration: 8000,
          isClosable: true,
        });

        Router.push("/password/reset");
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
        maxW={[308, 400]}
        bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleForgotPassword)}
      >
        <Box align="center">
          <Logo />

          <Box mt="6">
            <Input
              name="email"
              type="email"
              label="E-mail"
              error={errors.email}
              {...register("email")}
            />
          </Box>

          <Button
            label="Enviar token"
            type="submit"
            mt="6"
            colorScheme="green"
            size="lg"
            w="100%"
            isLoading={formState.isSubmitting}
          />

          <Divider mt="8" />

          <Flex mt="6" justify="center">
            <Link color="green.500" href="/password/reset">
              Já tenho o token
            </Link>
          </Flex>

          <Flex mt="6" justify="center">
            <Link href="/">Voltar ao login</Link>
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
