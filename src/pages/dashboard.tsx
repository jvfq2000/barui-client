import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";

import {
  Flex,
  SimpleGrid,
  Box,
  Text,
  Stack,
  useColorMode,
  useToast,
} from "@chakra-ui/react";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/apiClient";
import { useCan } from "../services/hooks/useCan";
import { IChart } from "../services/hooks/useCharts";
import {
  getStudentActivities,
  IStudentActivity,
} from "../services/hooks/useStudentActivities";
import { withSSRAuth } from "../shared/withSSRAuth";
import { accessLevel } from "../utils/permitions";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Dashboard(): JSX.Element {
  const toast = useToast();
  const { user } = useContext(AuthContext);
  const { colorMode } = useColorMode();

  const [allStudentActivities, setAllStudentActivities] =
    useState<IStudentActivity[]>();
  const [chart, setChart] = useState<IChart>();

  useEffect(() => {
    if (user?.accessLevel === accessLevel[0]) {
      getStudentActivities({
        filter: "",
        isActive: true,
        page: 1,
        registersPerPage: 10000,
      }).then(result => {
        setAllStudentActivities(result.studentActivities);
      });
    }
  }, []);

  useEffect(() => {
    if (user?.accessLevel === accessLevel[0]) {
      api
        .get("charts/by-student-id")
        .then(response => {
          setChart(response.data);
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
    }
  }, []);

  const options: ApexOptions = {
    colors: ["#20E647"],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "55%",
          background: "#293450",
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15,
          },
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: "#fff",
            fontSize: "13px",
          },
          value: {
            color: "#fff",
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        gradientToColors: ["#87D4F9"],
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: [
      "Atividades cadastradas",
      "Atividades deferidas",
      "Atividades indeferidas",
      "Atividades em análise",
    ],
  };

  let series = [];

  if (allStudentActivities && chart) {
    const { totalHours, totalApprovedHours, rejectedHours, hoursNotAnalyzed } =
      allStudentActivities?.reduce(
        (acc, studentActivity) => {
          acc.totalHours += studentActivity.hours;

          if (studentActivity.approvedHours) {
            acc.totalApprovedHours += studentActivity.approvedHours;

            acc.rejectedHours +=
              studentActivity.hours - studentActivity.approvedHours < 0
                ? 0
                : studentActivity.hours - studentActivity.approvedHours;
          } else {
            acc.hoursNotAnalyzed += studentActivity.hours;
          }

          return acc;
        },
        {
          totalApprovedHours: 0,
          totalHours: 0,
          rejectedHours: 0,
          hoursNotAnalyzed: 0,
        },
      );

    const percent = 100 / chart.minHours;

    series = [
      Math.round(totalHours * percent),
      Math.round(totalApprovedHours * percent),
      Math.round(rejectedHours * percent),
      Math.round(hoursNotAnalyzed * percent),
    ];
  }

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxW={1460} mx="auto" px={["2", "6"]}>
        <Sidebar />

        <Box w="100%" color="white">
          <Stack
            direction={["column", "row"]}
            spacing={["2", "8"]}
            mb="4"
            alignItems="center"
          >
            <Text
              fontWeight={400}
              color={colorMode === "dark" ? "grayDark.100" : "grayLight.100"}
              fontSize="xl"
            >
              Seja bem-vindo, {user?.name}!
            </Text>
          </Stack>

          {!useCan(accessLevel[1]) && (
            <SimpleGrid flex="1" gap="4" minChildWidth={[280, 320]}>
              <Box
                p="2"
                bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
                borderRadius={8}
                pb="4"
              >
                <Text
                  textAlign="center"
                  fontSize="xl"
                  mb="4"
                  color={colorMode === "dark" ? "grayDark.50" : "grayLight.50"}
                >
                  Atividades complementares
                </Text>
                <Chart
                  options={options}
                  series={series}
                  type="radialBar"
                  height={335}
                />
              </Box>
            </SimpleGrid>
          )}
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
