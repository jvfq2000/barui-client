import Link from "next/link";
import { useState, useContext } from "react";
import { RiAddCircleLine, RiDownload2Line } from "react-icons/ri";

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
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link as ChakraLink,
} from "@chakra-ui/react";

import { Can } from "../../components/Can";
import { Button } from "../../components/form/Button";
import { Header } from "../../components/Header";
import { MountOptionsList } from "../../components/MountOptionsList";
import { Pagination } from "../../components/Pagination";
import { CardRegulation } from "../../components/regulations/CardRegulation";
import { RegulationOptionsModal } from "../../components/regulations/RegulationOptionsModal";
import { Sidebar } from "../../components/Sidebar";
import { AuthContext } from "../../contexts/AuthContext";
import {
  IRegulation,
  useRegulations,
} from "../../services/hooks/useRegulations";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { defaultBgColor } from "../../utils/generateBgColor";
import { accessLevel } from "../../utils/permitions";

export default function RegulationList(): JSX.Element {
  const { user } = useContext(AuthContext);
  const [regulationSelected, setRegulationSelected] = useState<IRegulation>(
    {} as IRegulation,
  );
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [listInTable, setListInTable] = useState(true);
  const { data, isLoading, isFetching, error } = useRegulations({
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

  function onOpenModal(regulation: IRegulation) {
    setRegulationSelected(regulation);
    onOpen();
  }

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
              Regulamentos
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

            {isWideVersion && user.accessLevel !== accessLevel[0] && (
              <MountOptionsList
                listInTable={listInTable}
                setListInTable={setListInTable}
                isActive={isActive}
                setIsActive={setIsActive}
                labelFilter="Filtrar cursos"
                setFilter={setFilter}
              />
            )}

            {isWideVersion && user.accessLevel === accessLevel[0] && (
              <MountOptionsList
                listInTable={listInTable}
                setListInTable={setListInTable}
                labelFilter="Filtrar cursos"
                setFilter={setFilter}
              />
            )}

            <Can accessLevel={accessLevel[3]}>
              <Link href="/regulations/create" passHref>
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

          {!isWideVersion && user.accessLevel !== accessLevel[0] && (
            <VStack spacing="4" mb="6" justify="center">
              <MountOptionsList
                listInTable={listInTable}
                setListInTable={setListInTable}
                isActive={isActive}
                setIsActive={setIsActive}
                labelFilter="Filtrar campus"
                setFilter={setFilter}
              />
            </VStack>
          )}

          {!isWideVersion && user.accessLevel === accessLevel[0] && (
            <VStack spacing="4" mb="6" justify="center">
              <MountOptionsList
                listInTable={listInTable}
                setListInTable={setListInTable}
                labelFilter="Filtrar campus"
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
                <Text>Falha ao obter regulamentos.</Text>
              </Flex>
            ) : (
              <>
                {((!listInTable && isWideVersion) || !isWideVersion) && (
                  <SimpleGrid flex="1" gap="4" minChildWidth={[280, 340]}>
                    {data.regulations.map(regulation => {
                      return (
                        <Box
                          key={regulation.id}
                          onClick={() => {
                            if (user.accessLevel !== accessLevel[0]) {
                              onOpenModal(regulation);
                            }
                          }}
                        >
                          <CardRegulation
                            userAccessLevel={user.accessLevel}
                            name={regulation.name}
                            inForceFrom={regulation.inForceFrom}
                            fileUrl={regulation.fileUrl}
                            isActive={regulation.isActive}
                            createdAt={regulation.createdAt}
                          />
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                )}

                {listInTable && isWideVersion && !!data.regulations.length && (
                  <Table variant="simple" size="md">
                    <Thead>
                      <Tr>
                        <Th>nome</Th>
                        <Th>em vigor a partir de</Th>
                        <Th>cadastrado em</Th>
                        {user.accessLevel !== accessLevel[0] && <Th>status</Th>}
                        {user.accessLevel === accessLevel[0] && <Th>ações</Th>}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.regulations.map(regulation => {
                        return (
                          <Tr
                            key={regulation.id}
                            _hover={
                              user.accessLevel !== accessLevel[0]
                                ? {
                                    bg:
                                      colorMode === "dark"
                                        ? "grayDark.700"
                                        : "grayLight.700",
                                    cursor: "pointer",
                                  }
                                : {}
                            }
                            onClick={() => {
                              if (user.accessLevel !== accessLevel[0]) {
                                onOpenModal(regulation);
                              }
                            }}
                          >
                            <Td>{regulation.name} </Td>
                            <Td>{regulation.inForceFrom}</Td>
                            <Td>{regulation.createdAt}</Td>
                            {user.accessLevel !== accessLevel[0] && (
                              <Td
                                color={
                                  regulation.isActive ? "green.500" : "red.700"
                                }
                              >
                                {regulation.isActive ? "Ativo" : "Inativo"}
                              </Td>
                            )}
                            {user.accessLevel === accessLevel[0] && (
                              <Td color="green.500">
                                <ChakraLink
                                  href={regulation.fileUrl}
                                  isExternal
                                >
                                  <Icon
                                    size="md"
                                    as={RiDownload2Line}
                                    color="green.500"
                                  />
                                </ChakraLink>
                              </Td>
                            )}
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
      <RegulationOptionsModal
        regulation={regulationSelected}
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
