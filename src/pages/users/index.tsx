import Link from "next/link";
import { useState } from "react";
import { RiAddLine, RiUserAddFill } from "react-icons/ri";

import {
  Box,
  Flex,
  Heading,
  Button,
  Icon,
  Text,
  useBreakpointValue,
  Spinner,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";

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
  const { data, isLoading, isFetching, error } = useUsers({
    page,
    filter,
  });

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
        <Box flex="1" borderRadius={8}>
          <Flex mb="6" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>

            {isWideVersion && (
              <Search
                placeholder="Filtrar usuários"
                handleOnClick={setFilter}
              />
            )}

            <Link href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="green"
                leftIcon={<Icon as={RiUserAddFill} fontSize="20" />}
              >
                Criar novo
              </Button>
            </Link>
          </Flex>

          {!isWideVersion && (
            <Box mb="6" align="center">
              <Search
                placeholder="Filtrar usuários"
                handleOnClick={setFilter}
              />
            </Box>
          )}

          {
            // eslint-disable-next-line no-nested-ternary
            isLoading ? (
              <Flex justify="center">
                <Spinner />
              </Flex>
            ) : error ? (
              <Flex>
                <Text>Falha ao obter dados dos usuários.</Text>
              </Flex>
            ) : (
              <>
                <SimpleGrid
                  flex="1"
                  gap="4"
                  minChildWidth={[280, 320]}
                  aling="flex-start"
                >
                  {data.users.map(user => {
                    return (
                      <Box
                        onClick={() => {
                          onOpenModal(user);
                        }}
                      >
                        <CardUser
                          key={user.id}
                          name={user.name}
                          lastName={user.lastName}
                          email={user.email}
                          accessLevel={user.accessLevel}
                          avatar={user.avatar}
                          avatarUrl={user.avatarUrl}
                          isActive={user.isActive}
                          createdAt={user.createdAt}
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
      <UserOptionsModal
        user={userSelected}
        isOpen={isOpen}
        onClose={onClose}
      ></UserOptionsModal>
    </Box>
  );
}

const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
}, accessLevel[3]);

export { getServerSideProps };
