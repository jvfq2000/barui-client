import Link from "next/link";
import { useState } from "react";
import { RiAddCircleLine } from "react-icons/ri";

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
  Switch,
} from "@chakra-ui/react";

import { ActivityCategoryOptionsModal } from "../../components/activityCategories/ActivityCategoryOptionsModal";
import { CardActivityCategory } from "../../components/activityCategories/CardActivityCategory";
import { Header } from "../../components/Header";
import { Search } from "../../components/Header/Search";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import {
  IActivityCategory,
  useActivityCategories,
} from "../../services/hooks/useActivityCategories";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

export default function ActivityCategoryList(): JSX.Element {
  const [activityCategorySelected, setActivityCategorySelected] =
    useState<IActivityCategory>({} as IActivityCategory);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isActive, setIsActive] = useState(true);
  const { data, isLoading, isFetching, error } = useActivityCategories({
    page,
    filter,
    isActive,
  });

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
        <Box flex="1" borderRadius={8}>
          <Flex mb="6" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Cat. de Atividades
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>

            {isWideVersion && (
              <>
                <Text>
                  Status:
                  <Switch
                    ml="2"
                    colorScheme="green"
                    isChecked={isActive}
                    onChange={() => {
                      setIsActive(!isActive);
                    }}
                  ></Switch>
                </Text>
                <Search
                  placeholder="Filtrar categorias"
                  handleOnClick={setFilter}
                />
              </>
            )}

            <Link href="/activity-categories/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="green"
                leftIcon={<Icon as={RiAddCircleLine} fontSize="20" />}
              >
                Criar nova
              </Button>
            </Link>
          </Flex>

          {!isWideVersion && (
            <Flex mb="6" align="center" justify="center">
              <Text>
                Status
                <Switch
                  ml="1"
                  colorScheme="green"
                  isChecked={isActive}
                  onChange={() => {
                    setIsActive(!isActive);
                  }}
                ></Switch>
              </Text>
              <Search
                placeholder="Filtrar categorias"
                handleOnClick={setFilter}
              />
            </Flex>
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
