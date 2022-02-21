import { useContext } from "react";
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
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "../components/form/Button";
import { Input } from "../components/form/Input";
import { Logo } from "../components/Header/Logo";
import { AuthContext } from "../contexts/AuthContext";
import { withSSRGuest } from "../shared/withSSRGuest";
import { IShowToast } from "../utils/iShowToast";

interface ISignInFormData {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatória"),
});

export default function SignIn(): JSX.Element {
  const { signIn } = useContext(AuthContext);
  const toast = useToast();
  const { colorMode } = useColorMode();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });
  const { errors } = formState;

  function showToast({ description, status }: IShowToast) {
    toast({
      description,
      status,
      position: "top",
      duration: 8000,
      isClosable: true,
    });
  }

  const handleSignIn: SubmitHandler<ISignInFormData> = async data => {
    await signIn({ showToast, ...data });
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
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Box align="center">
          <Logo />

          <VStack spacing="4" mt="6">
            <Input
              name="email"
              type="email"
              label="E-mail"
              error={errors.email}
              {...register("email")}
            />
            <Input
              name="password"
              type="password"
              label="Senha"
              error={errors.password}
              {...register("password")}
            />
          </VStack>

          <Button
            label="Entrar"
            type="submit"
            mt="6"
            colorScheme="green"
            size="lg"
            w="100%"
            isLoading={formState.isSubmitting}
          />

          <Divider mt="8" />

          <Flex mt="6" justify="center">
            <Link href="/password/forgot">Esqueceu sua senha?</Link>
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
