import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Box,
  Flex,
  Heading,
  useBreakpointValue,
  SimpleGrid,
  useColorMode,
  VStack,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Avatar,
  useToast,
} from "@chakra-ui/react";

import { Header } from "../../../components/Header";
import { MountOptionsList } from "../../../components/MountOptionsList";
import { Sidebar } from "../../../components/Sidebar";
import { CardStudent } from "../../../components/studentActivities/CardStudent";
import { api } from "../../../services/apiClient";
import { withSSRAuth } from "../../../shared/withSSRAuth";
import { defaultBgColor } from "../../../utils/generateBgColor";
import { accessLevel } from "../../../utils/permitions";

interface IStudent {
  userId: string;
  userName: string;
  avatar: string;
  avatarUrl: string;
  initialSemester: string;
  registeredHours: number;
  approvedHours: number;
  rejectedHours: number;
  hoursNotAnalyzed: number;
}

export default function UserList(): JSX.Element {
  const toast = useToast();
  const [students, setStudents] = useState<IStudent[]>();
  const [listInTable, setListInTable] = useState(true);

  const { colorMode } = useColorMode();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  useEffect(() => {
    api
      .get("student-activities/students")
      .then(response => {
        setStudents(response.data);
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
  }, []);

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px={[4, 6]}>
        <Sidebar />
        <Box
          flex="1"
          borderRadius={8}
          p={listInTable && isWideVersion ? "8" : "0"}
          bg={defaultBgColor(listInTable, isWideVersion, colorMode)}
        >
          <Flex mb="6" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Alunos
            </Heading>

            {isWideVersion && (
              <MountOptionsList
                listInTable={listInTable}
                setListInTable={setListInTable}
              />
            )}
          </Flex>

          {!isWideVersion && (
            <VStack spacing="4" mb="6" justify="center">
              <MountOptionsList
                listInTable={listInTable}
                setListInTable={setListInTable}
              />
            </VStack>
          )}

          <>
            {((!listInTable && isWideVersion) || !isWideVersion) && (
              <SimpleGrid flex="1" gap="4" minChildWidth={[280, 340]}>
                {students?.map(student => {
                  return (
                    <Link
                      key={student.userId}
                      href={{
                        pathname: "/student-activities/students/activities",
                        query: { id: student.userId },
                      }}
                    >
                      <Box>
                        <CardStudent
                          userName={student.userName}
                          avatar={student.avatar}
                          avatarUrl={student.avatarUrl}
                          initialSemester={student.initialSemester}
                          registeredHours={student.registeredHours}
                          approvedHours={student.approvedHours}
                          rejectedHours={student.rejectedHours}
                          hoursNotAnalyzed={student.hoursNotAnalyzed}
                        />
                      </Box>
                    </Link>
                  );
                })}
              </SimpleGrid>
            )}

            {listInTable && isWideVersion && !!students?.length && (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th />
                    <Th>nome</Th>
                    <Th>primeiro semestre</Th>
                    <Th>horas cadastradas</Th>
                    <Th>horas deferidas</Th>
                    <Th>horas indeferidas</Th>
                    <Th>horas em análise</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {students?.map(student => {
                    return (
                      <Link
                        key={student.userId}
                        href={{
                          pathname: "/student-activities/students/activities",
                          query: { id: student.userId },
                        }}
                      >
                        <Tr
                          _hover={{
                            bg:
                              colorMode === "dark"
                                ? "grayDark.700"
                                : "grayLight.700",
                            cursor: "pointer",
                          }}
                        >
                          <Td>
                            <Avatar
                              size="lg"
                              name={student.userName}
                              src={student.avatar && student.avatarUrl}
                            />
                          </Td>
                          <Td>{student.userName}</Td>
                          <Td>{student.initialSemester}</Td>
                          <Td>{student.registeredHours}</Td>
                          <Td>{student.approvedHours}</Td>
                          <Td>{student.rejectedHours}</Td>
                          <Td>{student.hoursNotAnalyzed}</Td>
                        </Tr>
                      </Link>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </>
        </Box>
      </Flex>
    </Box>
  );
}

const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
}, accessLevel[1]);

export { getServerSideProps };
