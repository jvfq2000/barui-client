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
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Avatar,
} from "@chakra-ui/react";

import { Button } from "../../components/form/Button";
import { Header } from "../../components/Header";
import { MountOptionsList } from "../../components/MountOptionsList";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { CardUser } from "../../components/users/CardUser";
import { UserOptionsModal } from "../../components/users/UserOptionsModal";
import { IUser, useUsers } from "../../services/hooks/useUsers";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { defaultBgColor } from "../../utils/generateBgColor";
import { accessLevel } from "../../utils/permitions";

export default function UserList(): JSX.Element {
  const [userSelected, setUserSelected] = useState<IUser>({} as IUser);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [listInTable, setListInTable] = useState(true);
  const { data, isLoading, isFetching, error } = useUsers({
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

  function onOpenModal(user: IUser) {
    setUserSelected(user);
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
              Usuários
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
              <MountOptionsList
                listInTable={listInTable}
                setListInTable={setListInTable}
                isActive={isActive}
                setIsActive={setIsActive}
                labelFilter="Filtrar usuários"
                setFilter={setFilter}
              />
            )}

            <Link href="/users/create" passHref>
              <Button
                label="Criar novo"
                colorScheme="green"
                as="a"
                size="sm"
                fontSize="sm"
                leftIcon={<Icon as={RiAddCircleLine} fontSize="20" />}
              />
            </Link>
          </Flex>

          {!isWideVersion && (
            <VStack spacing="4" mb="6" justify="center">
              <MountOptionsList
                listInTable={listInTable}
                setListInTable={setListInTable}
                isActive={isActive}
                setIsActive={setIsActive}
                labelFilter="Filtrar usuários"
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
                <Text>Falha ao obter usuários.</Text>
              </Flex>
            ) : (
              <>
                {((!listInTable && isWideVersion) || !isWideVersion) && (
                  <SimpleGrid flex="1" gap="4" minChildWidth={[280, 340]}>
                    {data.users.map(user => {
                      return (
                        <Box
                          key={user.id}
                          onClick={() => {
                            onOpenModal(user);
                          }}
                        >
                          <CardUser
                            name={user.name}
                            lastName={user.lastName}
                            email={user.email}
                            avatar={user.avatar}
                            avatarUrl={user.avatarUrl}
                            accessLevel={user.accessLevel}
                            isActive={user.isActive}
                            createdAt={user.createdAt}
                          />
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                )}

                {listInTable && isWideVersion && !!data.users.length && (
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th />
                        <Th>nome</Th>
                        <Th>email</Th>
                        <Th>nível de acesso</Th>
                        <Th>cadastrado em</Th>
                        <Th>status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.users.map(user => {
                        return (
                          <Tr
                            key={user.id}
                            _hover={{
                              bg:
                                colorMode === "dark"
                                  ? "grayDark.700"
                                  : "grayLight.700",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              onOpenModal(user);
                            }}
                          >
                            <Td>
                              <Avatar
                                size="lg"
                                name={user.name}
                                src={user.avatar && user.avatarUrl}
                              />
                            </Td>
                            <Td>{`${user.name} ${user.lastName}`} </Td>
                            <Td>{user.email}</Td>
                            <Td>
                              {user.accessLevel[0].toUpperCase() +
                                user.accessLevel.substring(1)}
                            </Td>
                            <Td>{user.createdAt}</Td>
                            <Td color={user.isActive ? "green.500" : "red.700"}>
                              {user.isActive ? "Ativo" : "Inativo"}
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
      <UserOptionsModal user={userSelected} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
}, accessLevel[3]);

export { getServerSideProps };
