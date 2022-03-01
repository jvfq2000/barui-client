import Router from "next/router";
import { useEffect, useState } from "react";
import { RiFileTextLine } from "react-icons/ri";

import {
  Box,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
  Spinner,
  SimpleGrid,
  useDisclosure,
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
  Icon,
  HStack,
} from "@chakra-ui/react";

import { Button } from "../../../components/form/Button";
import { Header } from "../../../components/Header";
import { MountOptionsList } from "../../../components/MountOptionsList";
import { Pagination } from "../../../components/Pagination";
import { Sidebar } from "../../../components/Sidebar";
import { CardStudentActivity } from "../../../components/studentActivities/CardStudentActivity";
import { StudentActivityOptionsModal } from "../../../components/studentActivities/StudentActivityOptionsModal";
import { api } from "../../../services/apiClient";
import {
  getStudentActivities,
  IStudentActivity,
  useStudentActivities,
} from "../../../services/hooks/useStudentActivities";
import { IUser } from "../../../services/hooks/useUsers";
import { generateFormActivitiesPDF } from "../../../shared/docs/FormActivitiesPDF";
import { generateFormReportCardPDF } from "../../../shared/docs/FormReportCardPDF";
import { withSSRAuth } from "../../../shared/withSSRAuth";
import { defaultBgColor } from "../../../utils/generateBgColor";
import { accessLevel } from "../../../utils/permitions";

export default function StudentActivityList(): JSX.Element {
  const { id } = Router.query;
  const toast = useToast();

  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [studentActivitySelected, setStudentActivitySelected] =
    useState<IStudentActivity>({} as IStudentActivity);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [listInTable, setListInTable] = useState(true);
  const [allStudentActivities, setAllStudentActivities] =
    useState<IStudentActivity[]>();
  const { data, isLoading, isFetching, error } = useStudentActivities({
    page,
    filter,
    isActive,
    userId: String(id),
  });

  const { colorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  useEffect(() => {
    getStudentActivities({
      filter: "",
      isActive: true,
      page: 1,
      registersPerPage: 10000,
      userId: String(id),
    }).then(result => {
      setAllStudentActivities(result.studentActivities);
    });
  }, []);

  function onOpenModal(studentActivity: IStudentActivity) {
    setStudentActivitySelected(studentActivity);
    onOpen();
  }

  useEffect(() => {
    api
      .get(`users/by-id?userId=${id}`)
      .then(response => {
        const { name, lastName, avatar, avatarUrl } = response.data as IUser;

        setUserName(`${name} ${lastName}`);
        setAvatar(avatar);
        setAvatarUrl(avatarUrl);
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
          flex="1"
          borderRadius={8}
          p={listInTable && isWideVersion ? "8" : "0"}
          bg={defaultBgColor(listInTable, isWideVersion, colorMode)}
        >
          <VStack mb="6" justify="center">
            <Avatar size="2xl" name={userName} src={avatar && avatarUrl} />
            <Text fontSize="md">{userName}</Text>
          </VStack>

          <Flex
            mb="6"
            justify={isWideVersion ? "space-between" : "center"}
            align="center"
          >
            <Heading size="lg" fontWeight="normal">
              Atividades
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
                <MountOptionsList
                  listInTable={listInTable}
                  setListInTable={setListInTable}
                  isActive={isActive}
                  setIsActive={setIsActive}
                  labelFilter="Filtrar atividades"
                  setFilter={setFilter}
                />

                <Button
                  ml="2"
                  label="Formulário"
                  size="sm"
                  fontSize="sm"
                  colorScheme="green"
                  leftIcon={<Icon as={RiFileTextLine} fontSize="20" />}
                  onClick={() => {
                    generateFormActivitiesPDF(allStudentActivities);
                  }}
                />

                <Button
                  ml="2"
                  label="Boletim"
                  size="sm"
                  fontSize="sm"
                  colorScheme="green"
                  leftIcon={<Icon as={RiFileTextLine} fontSize="20" />}
                  onClick={() => {
                    generateFormReportCardPDF(allStudentActivities);
                  }}
                />
              </>
            )}
          </Flex>

          {!isWideVersion && (
            <VStack spacing="4" mb="6" justify="center">
              <HStack>
                <Button
                  ml="2"
                  label="Formulário"
                  size="sm"
                  fontSize="sm"
                  colorScheme="green"
                  leftIcon={<Icon as={RiFileTextLine} fontSize="20" />}
                  onClick={() => {
                    generateFormActivitiesPDF(data.studentActivities);
                  }}
                />

                <Button
                  ml="2"
                  label="Boletim"
                  size="sm"
                  fontSize="sm"
                  colorScheme="green"
                  leftIcon={<Icon as={RiFileTextLine} fontSize="20" />}
                  onClick={() => {
                    generateFormReportCardPDF(data.studentActivities);
                  }}
                />
              </HStack>

              <MountOptionsList
                listInTable={listInTable}
                setListInTable={setListInTable}
                isActive={isActive}
                setIsActive={setIsActive}
                labelFilter="Filtrar atividades"
                setFilter={setFilter}
              />
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
                <Text>Falha ao obter cursos.</Text>
              </Flex>
            ) : (
              <>
                {((!listInTable && isWideVersion) || !isWideVersion) && (
                  <SimpleGrid flex="1" gap="4" minChildWidth={[280, 340]}>
                    {data.studentActivities.map(studentActivity => {
                      return (
                        <Box
                          key={studentActivity.id}
                          onClick={() => {
                            onOpenModal(studentActivity);
                          }}
                        >
                          <CardStudentActivity
                            description={studentActivity.description}
                            semester={studentActivity.semester}
                            approvedHours={studentActivity.approvedHours}
                            hours={studentActivity.hours}
                            isCertified={studentActivity.isCertified}
                            isActive={studentActivity.isActive}
                            createdAt={studentActivity.createdAt}
                          />
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                )}

                {listInTable &&
                  isWideVersion &&
                  !!data.studentActivities.length && (
                    <Table variant="simple" size="md">
                      <Thead>
                        <Tr>
                          <Th>descrição</Th>
                          <Th>semestre</Th>
                          <Th>comprovado</Th>
                          <Th>qtd. horas</Th>
                          <Th>qtd. horas aprovadas</Th>
                          <Th>cadastrado em</Th>
                          <Th>status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data.studentActivities.map(studentActivity => {
                          return (
                            <Tr
                              key={studentActivity.id}
                              _hover={{
                                bg:
                                  colorMode === "dark"
                                    ? "grayDark.700"
                                    : "grayLight.700",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                onOpenModal(studentActivity);
                              }}
                            >
                              <Td>{studentActivity.description} </Td>
                              <Td>{studentActivity.semester} </Td>
                              <Td>
                                {studentActivity.isCertified ? "Sim" : "Não"}
                              </Td>
                              <Td>{studentActivity.hours}</Td>
                              <Td>{studentActivity.approvedHours}</Td>
                              <Td>{studentActivity.createdAt}</Td>
                              <Td
                                color={
                                  studentActivity.isActive
                                    ? "green.500"
                                    : "red.700"
                                }
                              >
                                {studentActivity.isActive ? "Ativo" : "Inativo"}
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  )}

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
      <StudentActivityOptionsModal
        studentActivity={studentActivitySelected}
        isOpen={isOpen}
        onClose={onClose}
        userId={String(id)}
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
