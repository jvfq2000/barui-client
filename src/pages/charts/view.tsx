import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RiArrowGoBackFill } from "react-icons/ri";
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
import { Button } from "../../components/form/Button";
import { Input } from "../../components/form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/apiClient";
import { IChart } from "../../services/hooks/useCharts";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

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
  course: yup.string().required("Curso obrigatório"),
});

export default function CreateChart(): JSX.Element {
  const { id } = Router.query;
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [categories, setCategories] = useState<ICategory[]>();
  const [chart, setChart] = useState<IChart>();
  const [listInTable, setListInTable] = useState(true);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const { register, formState, setValue } = useForm({
    resolver: yupResolver(createChartFormSchema),
  });

  const { errors } = formState;

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

  useEffect(() => {
    api
      .get(`charts/by-id?chartId=${id}`)
      .then(response => {
        const chartResponse = response.data as IChart;
        setChart(chartResponse);

        setValue("name", chartResponse.name);
        setValue("inForceFrom", chartResponse.inForceFrom);
        setValue("course", chartResponse.courseName);
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
        >
          <Heading size="lg" fontWeight="normal">
            Visualisar quadro
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
                isDisabled
                name="name"
                label="Nome"
                error={errors.name}
                {...register("name")}
              />
              <Input
                isDisabled
                name="inForceFrom"
                label="Em vigor a partir de"
                error={errors.inForceFrom}
                {...register("inForceFrom")}
              />
              <Input
                isDisabled
                name="course"
                label="Curso"
                error={errors.course}
                {...register("course")}
              />
            </SimpleGrid>
            {categories?.map(category => {
              const filterActivities = chart?.activities?.filter(
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
                            <Box key={activity.name}>
                              <CardActivity
                                showHover={false}
                                name={activity.name}
                                maxHours={activity.maxHours}
                                minHours={activity.minHours}
                                isActive={activity.isActive}
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
                            <Th>status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filterActivities.map(activity => {
                            return (
                              <Tr key={activity.name}>
                                <Td>{activity.name} </Td>
                                <Td>{`${activity.minHours} horas`}</Td>
                                <Td>{`${activity.maxHours} horas`}</Td>
                                <Td
                                  color={
                                    activity.isActive ? "green.500" : "red.700"
                                  }
                                >
                                  {activity.isActive ? "Ativo" : "Inativo"}
                                </Td>
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
                label="Voltar"
                colorScheme={colorMode === "light" ? "grayLight" : "grayDark"}
                leftIcon={<Icon as={RiArrowGoBackFill} fontSize="20" />}
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
}, accessLevel[3]);

export { getServerSideProps };
