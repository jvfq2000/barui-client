import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";
import { useMutation, useQuery } from "react-query";
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
  AspectRatio,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "../../../components/form/Button";
import { Input } from "../../../components/form/Input";
import { InputMask } from "../../../components/form/InputMask";
import { ISelectOption, Select } from "../../../components/form/Select";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { api } from "../../../services/apiClient";
import { IStudentActivity } from "../../../services/hooks/useStudentActivities";
import { queryClient } from "../../../services/queryClient";
import { withSSRAuth } from "../../../shared/withSSRAuth";
import { accessLevel } from "../../../utils/permitions";

interface IEditStudentActivityFormData {
  description: string;
  hours: number;
  approvedHours: number;
  semester: string;
  activityId: string;
  userId: string;
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

export default function EditStudentActivity(): JSX.Element {
  const { id, studentId } = Router.query;
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [activities, setActivities] = useState<IActivity[]>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [categoryId, setCategoryId] = useState("");
  const [isCertified, setIsCertified] = useState(1);
  const [studentActivity, setStudentActivity] = useState<IStudentActivity>();

  const editStudentActivityFormSchema = yup.object().shape({
    description: yup.string().required("Descrição obrigatória"),
    semester: yup.string().required("Semestre obrigatório"),
    hours: yup.string().required("Qtd. horas obrigatório"),
    approvedHours: yup.string().required("Qtd. horas deferidas obrigatório"),
    categoryId: yup.string(),
    activityId: yup.string().required("Atividade obrigatória"),
  });

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(editStudentActivityFormSchema),
  });

  const { errors } = formState;

  const editStudentActivity = useMutation(
    async (studentActivityForm: IEditStudentActivityFormData) => {
      const formData = new FormData();

      formData.append("hours", String(studentActivity.hours));
      formData.append("userId", studentActivity.userId);
      formData.append("isCertified", String(!!isCertified));
      formData.append("justification", studentActivity.justification);
      formData.append("file", studentActivity.file);

      formData.append("description", studentActivityForm.description);
      formData.append("semester", studentActivityForm.semester);
      formData.append(
        "approvedHours",
        String(studentActivityForm.approvedHours),
      );
      formData.append("activityId", studentActivityForm.activityId);

      api
        .put(`student-activities?studentActivityId=${id}&studentId`, formData)
        .then(response => {
          toast({
            description: "Atividade complementar alterada com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          Router.push(
            `/student-activities/students/activities?id=${studentId}`,
          );
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

  const handleEditStudentActivity: SubmitHandler<
    IEditStudentActivityFormData
  > = async data => {
    await editStudentActivity.mutateAsync(data);
  };

  useEffect(() => {
    api
      .get(`charts/by-student-id?studentId=${studentId}`)
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

  const { data, isLoading } = useQuery(
    ["activitiesSelect", categoryId],
    async (): Promise<IActivity[]> => {
      const { data } = await api.get(
        `charts/activities?chartId=${categories[0].chartId}&categoryId=${categoryId}`,
      );
      return data;
    },
    {
      staleTime: 1000 * 60 * 60,
    },
  );

  useEffect(() => {
    setActivities(data);
  }, [data]);

  useEffect(() => {
    api
      .get(`student-activities/by-id?studentActivityId=${id}`)
      .then(response => {
        const activity = response.data;

        setStudentActivity(activity);
        setCategoryId(activity.categoryId);
        setIsCertified(activity.isCertified ? 1 : 0);

        setValue("description", activity.description);
        setValue("semester", activity.semester);
        setValue("hours", activity.hours);
        setValue("approvedHours", activity.hours);
        setValue("activityId", activity.activityId);
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
          onSubmit={handleSubmit(handleEditStudentActivity)}
        >
          <Heading size="lg" fontWeight="normal">
            Alterar atividade complementar
          </Heading>

          <Divider my="6" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              {isCertified ? (
                <AspectRatio maxH="500px" ratio={1}>
                  <iframe
                    title="comprovação"
                    src={studentActivity?.fileUrl}
                    allowFullScreen
                  />
                </AspectRatio>
              ) : (
                <Input
                  isDisabled
                  name="justification"
                  label="Justificativa"
                  value={studentActivity?.justification}
                />
              )}
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="description"
                label="Descrição"
                error={errors.description}
                {...register("description")}
              />
              <Input
                isDisabled
                type="number"
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
                value={categoryId}
              />

              <Select
                name="activityId"
                placeholder={
                  isLoading ? "Buscando atividades ..." : "Selecione"
                }
                options={generateOptionsActivities()}
                label="Atividade"
                error={errors.activityId}
                {...register("activityId")}
                isDisabled={isLoading}
              />

              <Input
                type="number"
                name="approvedHours"
                label="Qtd. horas deferidas"
                error={errors.approvedHours}
                {...register("approvedHours")}
              />
            </SimpleGrid>
          </VStack>

          <Divider my="6" />

          <SimpleGrid flex="1" gap="4" minChildWidth={100}>
            <Link
              href={{
                pathname: "/student-activities/students/activities",
                query: { id: studentId },
              }}
              passHref
            >
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
}, accessLevel[0]);

export { getServerSideProps };
