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
  Divider,
  SimpleGrid,
  useToast,
  Icon,
  VStack,
  useColorMode,
  RadioGroup,
  HStack,
  Radio,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "../../components/form/Button";
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

interface ICreateStudentActivityFormData {
  description: string;
  hours: number;
  semester: string;
  isCertified: boolean;
  justification?: string;
  file?: File;
  activityId: string;
}

interface ICategory {
  id: string;
  name: string;
  chartId: string;
}

interface IActivity {
  id: string;
  name: string;
}

export default function CreateStudentActivity(): JSX.Element {
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [activities, setActivities] = useState<IActivity[]>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [categoryId, setCategoryId] = useState("");
  const [isCertified, setIsCertified] = useState(1);
  const [fileUpload, setFileUpload] = useState<File>(null);

  const createStudentActivityFormSchema = yup.object().shape({
    description: yup.string().required("Descrição obrigatória"),
    semester: yup.string().required("Semestre obrigatório"),
    hours: yup.string().required("Qtd. horas obrigatório"),
    isCertified: yup
      .string()
      .test("isCertifiedTest", "Campo obrigatório", () => {
        return isCertified === 0 || isCertified === 1;
      }),
    justification: yup
      .string()
      .test("justificationTest", "Justificativa obrigatória", value => {
        return !isCertified ? !!value : true;
      }),
    file: yup.string().test("fileTest", "Arquivo obrigatório", () => {
      return isCertified ? !!fileUpload : true;
    }),
    activityId: yup.string().required("Atividade obrigatória"),
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createStudentActivityFormSchema),
  });

  const { errors } = formState;

  const createStudentActivity = useMutation(
    async (studentActivity: ICreateStudentActivityFormData) => {
      const formData = new FormData();

      formData.append("file", fileUpload);
      formData.append("description", studentActivity.description);
      formData.append("semester", studentActivity.semester);
      formData.append("hours", String(studentActivity.hours));
      formData.append("isCertified", String(!!isCertified));
      formData.append("justification", studentActivity.justification);
      formData.append("activityId", studentActivity.activityId);

      api
        .post("student-activities", formData)
        .then(response => {
          toast({
            description: "Atividade complementar cadastrada com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          Router.push("/student-activities");
          return response.data.studentActivity;
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
        queryClient.invalidateQueries("studentActivities");
      },
    },
  );

  const handleCreateStudentActivity: SubmitHandler<
    ICreateStudentActivityFormData
  > = async data => {
    await createStudentActivity.mutateAsync(data);
  };

  const handleChangeFile = event => {
    const file = event.target.files[0];
    setFileUpload(file);
  };

  useEffect(() => {
    api
      .get("charts/by-student-id")
      .then(response => {
        const chart = response.data;

        api
          .get(`activity-categories/by-chart-id?chartId=${chart.id}`)
          .then(response => {
            const categories = response.data as ICategory[];

            const fullCategories = categories.map(category => {
              const fullCategory = category;
              fullCategory.chartId = chart.id;
              return fullCategory;
            });

            setCategories(fullCategories);
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

  useEffect(() => {
    if (categoryId) {
      api
        .get(
          `charts/activities?chartId=${categories[0].chartId}&categoryId=${categoryId}`,
        )
        .then(response => {
          const activities = response.data as IActivity[];
          setActivities(activities);
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
    }
  }, [categoryId]);

  function generateOptionsCategories(): ISelectOption[] {
    const options: ISelectOption[] = [];

    categories?.forEach(category => {
      options.push({
        value: category.id,
        label: category.name,
      });
    });

    return options;
  }

  function generateOptionsActivities(): ISelectOption[] {
    const options: ISelectOption[] = [];

    activities?.forEach(activity => {
      options.push({
        value: activity.id,
        label: activity.name,
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
          bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
          p={["6", "8"]}
          onSubmit={handleSubmit(handleCreateStudentActivity)}
        >
          <Heading size="lg" fontWeight="normal">
            Cadastrar atividade complementar
          </Heading>

          <Divider my="6" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="description"
                label="Descrição"
                error={errors.description}
                {...register("description")}
              />
              <Input
                name="hours"
                label="Qtd. horas"
                error={errors.hours}
                {...register("hours")}
              />
              <InputMask
                mask="*/****"
                placeholder="semestre/ano"
                maskChar="_"
                name="semester"
                label="Semestre"
                error={errors.semester}
                {...register("semester")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Select
                name="categoryId"
                placeholder="Selecione"
                options={generateOptionsCategories()}
                label="Categoria"
                onChange={event => {
                  setCategoryId(event.target.value);
                }}
              />

              <Select
                name="activityId"
                placeholder="Selecione"
                options={generateOptionsActivities()}
                label="Atividade"
                error={errors.activityId}
                {...register("activityId")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <FormControl>
                <FormLabel>Possui comprovação?</FormLabel>
                <RadioGroup
                  p="3"
                  borderRadius={8}
                  bg={colorMode === "dark" ? "grayDark.900" : "grayLight.900"}
                  onChange={() => {
                    setIsCertified(isCertified ? 0 : 1);
                  }}
                  value={isCertified}
                >
                  <HStack spacing={5}>
                    <Radio colorScheme="green" value={1}>
                      Sim
                    </Radio>
                    <Radio colorScheme="green" value={0}>
                      Não
                    </Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>

              {isCertified ? (
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
              ) : (
                <Input
                  name="justification"
                  label="Justificativa"
                  error={errors.justification}
                  {...register("justification")}
                />
              )}
            </SimpleGrid>
          </VStack>

          <Divider my="6" />

          <SimpleGrid flex="1" gap="4" minChildWidth={100}>
            <Link href="/student-activities" passHref>
              <Button
                label="Cancelar"
                colorScheme={colorMode === "light" ? "grayLight" : "grayDark"}
                leftIcon={<Icon as={RiCloseCircleLine} fontSize="20" />}
              />
            </Link>
            <Button
              label="Cadastrar"
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
}, accessLevel[0]);

export { getServerSideProps };
