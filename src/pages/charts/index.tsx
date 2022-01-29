import Link from "next/link";
import { useState } from "react";
import { RiAddCircleLine } from "react-icons/ri";

import {
  Box,
  Flex,
  Heading,
  Icon,
  Text,
  useBreakpointValue,
  Spinner,
  SimpleGrid,
  useDisclosure,
  useColorMode,
  VStack,
} from "@chakra-ui/react";

import { Can } from "../../components/Can";
import { CardChart } from "../../components/charts/CardChart";
import { ChartOptionsModal } from "../../components/charts/ChartOptionsModal";
import { Button } from "../../components/form/Button";
import { Switch } from "../../components/form/Switch";
import { Header } from "../../components/Header";
import { Search } from "../../components/Header/Search";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { IChart, useCharts } from "../../services/hooks/useCharts";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

export default function ChartList(): JSX.Element {
  const [chartSelected, setChartSelected] = useState<IChart>({} as IChart);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isActive, setIsActive] = useState(true);
  const { data, isLoading, isFetching, error } = useCharts({
    page,
    filter,
    isActive,
  });

  const { colorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  function onOpenModal(chart: IChart) {
    setChartSelected(chart);
    onOpen();
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px={[4, 6]}>
        <Sidebar />
        <Box flex="1" borderRadius={8}>
          <Flex mb="6" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Quadros
              {!isLoading && isFetching && (
                <Spinner
                  size="sm"
                  color={
                    colorMode === "dark" ? "grayDark.500" : "grayLight.500"
                  }
                  ml="4"
                />
              )}
            </Heading>

            {isWideVersion && (
              <>
                <Can accessLevel={accessLevel[3]}>
                  <Switch
                    labelLeft="Inativos"
                    labelRight="Ativos"
                    isActive={isActive}
                    setIsActive={setIsActive}
                  />
                </Can>
                <Search placeholder="Filtrar quadros" setSearch={setFilter} />
              </>
            )}

            <Can accessLevel={accessLevel[3]}>
              <Link href="/charts/create" passHref>
                <Button
                  label="Criar novo"
                  as="a"
                  size="sm"
                  fontSize="sm"
                  colorScheme="green"
                  leftIcon={<Icon as={RiAddCircleLine} fontSize="20" />}
                />
              </Link>
            </Can>
          </Flex>

          {!isWideVersion && (
            <VStack spacing="4" mb="6" justify="center">
              <Switch
                labelLeft="Inativos"
                labelRight="Ativos"
                isActive={isActive}
                setIsActive={setIsActive}
              />
              <Search placeholder="Filtrar categorias" setSearch={setFilter} />
            </VStack>
          )}

          {
            // eslint-disable-next-line no-nested-ternary
            isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex>
                <Text>Falha ao obter quadros.</Text>
              </Flex>
            ) : (
              <>
                <SimpleGrid
                  flex="1"
                  gap="4"
                  minChildWidth={[280, 340]}
                  align="flex-start"
                >
                  {data.charts.map(chart => {
                    return (
                      <Box
                        key={chart.id}
                        onClick={() => {
                          onOpenModal(chart);
                        }}
                      >
                        <CardChart
                          name={chart.name}
                          inForceFrom={chart.inForceFrom}
                          isActive={chart.isActive}
                          createdAt={chart.createdAt}
                        />
                      </Box>
                    );
                  })}
                </SimpleGrid>

                <Pagination
                  totalCountOfRegisters={data.totalCount}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </>
            )
          }
        </Box>
      </Flex>
      <ChartOptionsModal
        chart={chartSelected}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
}

const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
}, accessLevel[0]);

export { getServerSideProps };