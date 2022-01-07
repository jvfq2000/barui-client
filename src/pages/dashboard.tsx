import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useContext } from "react";

import { Flex, SimpleGrid, Box, Text, theme, Stack } from "@chakra-ui/react";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { AuthContext } from "../contexts/AuthContext";
import { withSSRAuth } from "../shared/withSSRAuth";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const options: ApexOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: "datetime",
    axisBorder: {
      color: theme.colors.gray[600],
    },
    axisTicks: {
      color: theme.colors.gray[600],
    },
    categories: [
      "2021-03-18T00:00:00.000Z",
      "2021-03-19T00:00:00.000Z",
      "2021-03-20T00:00:00.000Z",
      "2021-03-21T00:00:00.000Z",
      "2021-03-22T00:00:00.000Z",
      "2021-03-23T00:00:00.000Z",
      "2021-03-24T00:00:00.000Z",
    ],
  },
  fill: {
    opacity: 0.3,
    type: "gradient",
    gradient: {
      shade: "dark",
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
};
const series = [{ name: "series1", data: [31, 120, 10, 28, 61, 18, 109] }];

export default function Dashboard(): JSX.Element {
  const { user } = useContext(AuthContext);

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxW={1460} mx="auto" px="6">
        <Sidebar />

        <Box w="100%" color="white">
          <Stack
            direction={["column", "row"]}
            spacing={["2", "8"]}
            mb="4"
            alignItems="center"
          >
            <Text fontWeight={400} color="gray.100" fontSize="2xl">
              Olá, {user?.name}
            </Text>
            <Text color="gray.100">Que bom te encontrar aqui!</Text>
          </Stack>

          <SimpleGrid
            flex="1"
            gap="4"
            minChildWidth={[280, 320]}
            align="flex-start"
          >
            <Box p={["4", "8"]} bg="gray.800" borderRadius={8} pb="4">
              <Text fontSize="lg" mb="4">
                Inscritos da semana
              </Text>
              <Chart
                options={options}
                series={series}
                type="area"
                height={160}
              />
            </Box>

            <Box p={["6", "8"]} bg="gray.800" borderRadius={8} pb="4">
              <Text fontSize="lg" mb="4">
                Taxa de abertura
              </Text>
              <Chart
                options={options}
                series={series}
                type="area"
                height={160}
              />
            </Box>
          </SimpleGrid>
        </Box>
      </Flex>
    </Flex>
  );
}

const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
});

export { getServerSideProps };
