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
import { Switch } from "../../components/form/Switch";
import { Header } from "../../components/Header";
import { Search } from "../../components/Header/Search";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { CardUser } from "../../components/users/CardUser";
import { UserOptionsModal } from "../../components/users/UserOptionsModal";
import { IUser, useUsers } from "../../services/hooks/useUsers";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

export default function UserList(): JSX.Element {
  const [userSelected, setUserSelected] = useState<IUser>({} as IUser);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isActive, setIsActive] = useState(true);
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

  function bgColor(): string {
    if (isWideVersion) {
      return colorMode === "dark" ? "grayDark.800" : "grayLight.800";
    }
    return "";
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px={[4, 6]}>
        <Sidebar />
        <Box
          flex="1"
          borderRadius={8}
          p={isWideVersion ? "8" : "0"}
          bg={bgColor()}
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
              <>
                <Switch
                  labelLeft="Inativos"
                  labelRight="Ativos"
                  isActive={isActive}
                  setIsActive={setIsActive}
                />
                <Search placeholder="Filtrar usuários" setSearch={setFilter} />
              </>
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
                <Text>Falha ao obter usuários.</Text>
              </Flex>
            ) : (
              <>
                {!isWideVersion && (
                  <SimpleGrid
                    flex="1"
                    gap="4"
                    minChildWidth={[280, 340]}
                    align="flex-start"
                  >
                    {data.users.map(user => {
                      return (
                        <Box
                          key={user.id}
                          onClick={() => {
                            onOpenModal(user);
                          }}
                        >
                          <CardUser
                            identifier={user.identifier}
                            name={user.name}
                            lastName={user.lastName}
                            email={user.email}
                            courseName={user.courseName}
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

                {isWideVersion && (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th />
                        <Th>nome</Th>
                        <Th>email</Th>
                        <Th>nível de acesso</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.users.map(user => {
                        return (
                          <Tr key={user.id}>
                            <Td>
                              <Avatar
                                size="lg"
                                name={user.name}
                                src={user.avatar && user.avatarUrl}
                              />
                            </Td>
                            <Td>{`${user.name} ${user.lastName}`} </Td>
                            <Td>{user.email}</Td>
                            <Td>{user.accessLevel}</Td>
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
