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
} from "@chakra-ui/react";

import { ActivityCategoryOptionsModal } from "../../components/activityCategories/ActivityCategoryOptionsModal";
import { CardActivityCategory } from "../../components/activityCategories/CardActivityCategory";
import { Button } from "../../components/form/Button";
import { Header } from "../../components/Header";
import { MountOptionsList } from "../../components/MountOptionsList";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import {
  IActivityCategory,
  useActivityCategories,
} from "../../services/hooks/useActivityCategories";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { defaultBgColor } from "../../utils/generateBgColor";
import { accessLevel } from "../../utils/permitions";

export default function ActivityCategoryList(): JSX.Element {
  const [activityCategorySelected, setActivityCategorySelected] =
    useState<IActivityCategory>({} as IActivityCategory);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [listInTable, setListInTable] = useState(true);
  const { data, isLoading, isFetching, error } = useActivityCategories({
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

  function onOpenModal(activityCategory: IActivityCategory) {
    setActivityCategorySelected(activityCategory);
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
              Cat. de Atividades
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
                labelFilter="Filtrar categorias"
                setFilter={setFilter}
              />
            )}

            <Link href="/activity-categories/create" passHref>
              <Button
                label="Criar nova"
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
                labelFilter="Filtrar categorias"
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
                <Text>Falha ao obter categorias.</Text>
              </Flex>
            ) : (
              <>
                {((!listInTable && isWideVersion) || !isWideVersion) && (
                  <SimpleGrid
                    flex="1"
                    gap="4"
                    minChildWidth={[280, 340]}
                    align="flex-start"
                  >
                    {data.activityCategories.map(activityCategory => {
                      return (
                        <Box
                          key={activityCategory.id}
                          onClick={() => {
                            onOpenModal(activityCategory);
                          }}
                        >
                          <CardActivityCategory
                            name={activityCategory.name}
                            isActive={activityCategory.isActive}
                            createdAt={activityCategory.createdAt}
                          />
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                )}

                {listInTable && isWideVersion && (
                  <Table variant="simple" size="md">
                    <Thead>
                      <Tr>
                        <Th>nome</Th>
                        <Th>cadastrado em</Th>
                        <Th>status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data.activityCategories.map(activityCategory => {
                        return (
                          <Tr
                            key={activityCategory.id}
                            _hover={{
                              bg:
                                colorMode === "dark"
                                  ? "grayDark.700"
                                  : "grayLight.700",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              onOpenModal(activityCategory);
                            }}
                          >
                            <Td>{activityCategory.name} </Td>
                            <Td>{activityCategory.createdAt}</Td>
                            <Td
                              color={
                                activityCategory.isActive
                                  ? "green.500"
                                  : "red.700"
                              }
                            >
                              {activityCategory.isActive ? "Ativo" : "Inativo"}
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
      <ActivityCategoryOptionsModal
        activityCategory={activityCategorySelected}
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
}, accessLevel[3]);

export { getServerSideProps };
