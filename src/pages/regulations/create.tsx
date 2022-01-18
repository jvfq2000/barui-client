import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
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
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import { Input } from "../../components/form/Input";
import { InputFile } from "../../components/form/InputFile";
import { InputMask } from "../../components/form/InputMask";
import { ISelectOption, Select } from "../../components/form/Select";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { queryClient } from "../../services/queryClient";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

interface ICreateRegulationFormData {
  name: string;
  inForceFrom: string;
  file: File;
  courseId: string;
}

interface ICourse {
  id: string;
  name: string;
}

export default function CreateRegulation(): JSX.Element {
  const toast = useToast();
  const [courses, setCourses] = useState<ICourse[]>();
  const [fileUpload, setFileUpload] = useState<File>(null);

  const createRegulationFormSchema = yup.object().shape({
    name: yup.string().required("Nome obrigatório"),
    inForceFrom: yup.string().required("Em vigor é obrigatório"),
    file: yup.string().test("fileTest", "Arquivo obrigatório", () => {
      return !!fileUpload;
    }),
    courseId: yup.string().required("Curso obrigatório"),
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createRegulationFormSchema),
  });

  const { errors } = formState;

  const createRegulation = useMutation(
    async (regulation: ICreateRegulationFormData) => {
      const formData = new FormData();
      formData.append("file", fileUpload);
      formData.append("name", regulation.name);
      formData.append("inForceFrom", regulation.inForceFrom);
      formData.append("courseId", regulation.courseId);

      api
        .post("regulations", formData)
        .then(response => {
          toast({
            description: "Regulamento cadastrado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          Router.push("/regulations");
          return response.data.regulation;
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
        queryClient.invalidateQueries("regulations");
      },
    },
  );

  const handleCreateRegulation: SubmitHandler<
    ICreateRegulationFormData
  > = async data => {
    await createRegulation.mutateAsync(data);
  };

  const handleChangeFile = event => {
    const file = event.target.files[0];
    setFileUpload(file);
  };

  useEffect(() => {
    api
      .get(`courses/by-institution-id`)
      .then(response => {
        const courses = response.data as ICourse[];
        setCourses(courses);
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

  function generateOptionsCourses(): ISelectOption[] {
    const options: ISelectOption[] = [];

    courses?.forEach(course => {
      options.push({
        value: course.id,
        label: course.name,
      });
    });

    return options;
  }

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
          onSubmit={handleSubmit(handleCreateRegulation)}
        >
          <Heading size="lg" fontWeight="normal">
            Cadastar regulamento
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
              <InputMask
                mask="**/****"
                placeholder="01/2022"
                maskChar="_"
                name="inForceFrom"
                label="Em vigor a partir de"
                error={errors.inForceFrom}
                {...register("inForceFrom")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Select
                name="courseId"
                placeholder="Selecione"
                options={generateOptionsCourses()}
                label="Curso"
                error={errors.courseId}
                {...register("courseId")}
              />

              <Box position="relative" top="40%">
                <InputFile
                  name="file"
                  label={fileUpload?.name || "Selecionar arquivo"}
                  pt="1"
                  error={errors.file}
                  {...register("file")}
                  onChange={handleChangeFile}
                />
              </Box>
            </SimpleGrid>
          </VStack>

          <Divider my="6" borderColor="gray.700" />

          <SimpleGrid flex="1" gap="4" minChildWidth={100} align="flex-start">
            <Link href="/regulations" passHref>
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
