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
  Divider,
  SimpleGrid,
  useToast,
  Icon,
  useColorMode,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "../../components/form/Button";
import { Input } from "../../components/form/Input";
import { Select } from "../../components/form/Select";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

interface IEditCourseFormData {
  name: string;
  numberPeriods: number;
}

const editCourseFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  numberPeriods: yup.number().required("Duração obrigatória"),
});

export default function EditCourse(): JSX.Element {
  const { id } = Router.query;
  const toast = useToast();
  const { colorMode } = useColorMode();

  const editCourse = useMutation(
    async (course: IEditCourseFormData) => {
      api
        .put(`courses?courseId=${id}`, course)
        .then(response => {
          toast({
            description: "Curso alterado com sucesso.",
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

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(editCourseFormSchema),
  });
  const { errors } = formState;

  useEffect(() => {
    api
      .get(`courses/by-id?courseId=${id}`)
      .then(response => {
        const { name, numberPeriods } = response.data;

        setValue("name", name);
        setValue("numberPeriods", numberPeriods);
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

  const handleEditCourse: SubmitHandler<IEditCourseFormData> = async data => {
    await editCourse.mutateAsync(data);
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
          bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
          p={["6", "8"]}
          onSubmit={handleSubmit(handleEditCourse)}
        >
          <Heading size="lg" fontWeight="normal">
            Cadastar curso
          </Heading>

          <Divider my="6" />

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
              ]}
              label="Duração"
              error={errors.numberPeriods}
              {...register("numberPeriods")}
            />
          </SimpleGrid>

          <Divider my="6" />

          <SimpleGrid flex="1" gap="4" minChildWidth={100}>
            <Link href="/courses" passHref>
              <Button
                label="Cancelar"
                colorScheme={colorMode === "light" ? "grayLight" : "grayDark"}
                leftIcon={<Icon as={RiCloseCircleLine} fontSize="20" />}
              />
            </Link>
            <Button
              label="Alterar"
              type="submit"
              colorScheme="green"
              isLoading={formState.isSubmitting}
              leftIcon={<Icon as={RiCheckboxCircleLine} fontSize="20" />}
            />
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
