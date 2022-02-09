import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  RiAddCircleLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
} from "react-icons/ri";
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
  useDisclosure,
  useColorMode,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useBreakpointValue,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import { AlterList } from "../../components/AlterList";
import { CardActivity } from "../../components/charts/CardActivity";
import { PersistenceActivityModal } from "../../components/charts/PersistenceActivityModal";
import { Button } from "../../components/form/Button";
import { Input } from "../../components/form/Input";
import { InputMask } from "../../components/form/InputMask";
import { ISelectOption, Select } from "../../components/form/Select";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { IActivity } from "../../services/hooks/useCharts";
import { queryClient } from "../../services/queryClient";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

interface ICreateChartFormData {
  name: string;
  inForceFrom: string;
  minHours: number;
  file: File;
  courseId: string;
  activities: IActivity[];
}

interface ICourse {
  id: string;
  name: string;
}

interface ICategory {
  id: string;
  name: string;
}

const createChartFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  inForceFrom: yup.string().required("Em vigor é obrigatório"),
  minHours: yup.string().required("Qtd. mín horas é obrigatório"),
  courseId: yup.string().required("Curso obrigatório"),
});

export default function CreateChart(): JSX.Element {
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [courses, setCourses] = useState<ICourse[]>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [activities, setActivities] = useState<IActivity[]>();
  const [index, setIndex] = useState(0);
  const [listInTable, setListInTable] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createChartFormSchema),
  });

  const { errors } = formState;

  const createChart = useMutation(
    async (chart: ICreateChartFormData) => {
      const fullChart = chart;
      fullChart.activities = activities;

      api
        .post("charts", fullChart)
        .then(response => {
          toast({
            description: "Quadro de atividades cadastrado com sucesso.",
            status: "success",
            position: "top",
            duration: 8000,
            isClosable: true,
          });

          Router.push("/charts");
          return response.data.chart;
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
        queryClient.invalidateQueries("charts");
      },
    },
  );

  const handleCreateChart: SubmitHandler<ICreateChartFormData> = async data => {
    await createChart.mutateAsync(data);
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

  useEffect(() => {
    api
      .get(`activity-categories/by-institution-id`)
      .then(response => {
        const categories = response.data as ICourse[];
        setCategories(categories);
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

  function setIndexActivityByName(name: string) {
    activities.forEach((activity, index) => {
      if (activity.name === name) {
        setIndex(index);
        onOpen();
      }
    });
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
          onSubmit={handleSubmit(handleCreateChart)}
        >
          <Heading size="lg" fontWeight="normal">
            Cadastar quadro
            {isWideVersion && (
              <AlterList
                listInTable={listInTable}
                setListInTable={setListInTable}
              />
            )}
          </Heading>

          <Divider
            my="6"
            bordercolor={
              colorMode === "dark" ? "grayDark.700" : "grayLight.700"
            }
          />

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
                placeholder="semestre/ano"
                maskChar="_"
                name="inForceFrom"
                label="Em vigor a partir de"
                error={errors.inForceFrom}
                {...register("inForceFrom")}
              />
              <Input
                type="number"
                name="minHours"
                label="Qtd. min. horas"
                error={errors.minHours}
                {...register("minHours")}
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

              <Box w="100%" position="relative" top="42%">
                <Button
                  label="Adicionar atividade"
                  colorScheme="teal"
                  w="100%"
                  leftIcon={<Icon as={RiAddCircleLine} fontSize="20" />}
                  onClick={() => {
                    setIndex(null);
                    onOpen();
                  }}
                />
              </Box>
            </SimpleGrid>
            {categories?.map(category => {
              const filterActivities = activities?.filter(
                activity => activity.categoryId === category.id,
              );

              if (filterActivities?.length) {
                return (
                  <VStack
                    w="100%"
                    border="2px solid"
                    borderColor={
                      colorMode === "dark" ? "grayDark.700" : "grayLight.700"
                    }
                    borderRadius={8}
                    p={["1", "2"]}
                  >
                    <Text w="100%" textAlign="center">
                      {category.name}
                    </Text>
                    <Divider
                      borderColor={
                        colorMode === "dark" ? "grayDark.700" : "grayLight.700"
                      }
                    />
                    {(!listInTable && isWideVersion) || !isWideVersion ? (
                      <SimpleGrid
                        minChildWidth="240px"
                        spacing={["2", "4"]}
                        w="100%"
                      >
                        {filterActivities?.map(activity => {
                          return (
                            <Box
                              key={activity.name}
                              onClick={() => {
                                setIndexActivityByName(activity.name);
                              }}
                            >
                              <CardActivity
                                name={activity.name}
                                maxHours={activity.maxHours}
                                minHours={activity.minHours}
                              />
                            </Box>
                          );
                        })}
                      </SimpleGrid>
                    ) : (
                      <Table variant="simple" size="md">
                        <Thead>
                          <Tr>
                            <Th>nome</Th>
                            <Th>carga hor. mín.</Th>
                            <Th>carga hor. máx.</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filterActivities.map(activity => {
                            return (
                              <Tr
                                key={activity.name}
                                _hover={{
                                  bg:
                                    colorMode === "dark"
                                      ? "grayDark.700"
                                      : "grayLight.700",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setIndexActivityByName(activity.name);
                                }}
                              >
                                <Td>{activity.name} </Td>
                                <Td>{`${activity.minHours} horas`}</Td>
                                <Td>{`${activity.maxHours} horas`}</Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    )}
                  </VStack>
                );
              }
              return "";
            })}
          </VStack>

          <Divider
            my="6"
            bordercolor={
              colorMode === "dark" ? "grayDark.700" : "grayLight.700"
            }
          />

          <SimpleGrid flex="1" gap="4" minChildWidth={100} align="flex-start">
            <Link href="/charts" passHref>
              <Button
                label="Cancelar"
                colorScheme={colorMode === "light" ? "grayLight" : "grayDark"}
                leftIcon={<Icon as={RiCloseCircleLine} fontSize="20" />}
              />
            </Link>
            <Button
              label="Cadastrar"
              colorScheme="green"
              type="submit"
              isLoading={formState.isSubmitting}
              leftIcon={<Icon as={RiCheckboxCircleLine} fontSize="20" />}
            />
          </SimpleGrid>
        </Box>
      </Flex>

      <PersistenceActivityModal
        isOpen={isOpen}
        onClose={onClose}
        categories={categories}
        activities={activities}
        index={index}
        onSave={setActivities}
      />
    </Box>
  );
}

const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
}, accessLevel[3]);

export { getServerSideProps };
