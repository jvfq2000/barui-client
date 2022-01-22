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
  Switch,
  useColorMode,
} from "@chakra-ui/react";

import { Can } from "../../components/Can";
import { Button } from "../../components/form/Button";
import { Header } from "../../components/Header";
import { Search } from "../../components/Header/Search";
import { Pagination } from "../../components/Pagination";
import { CardRegulation } from "../../components/regulations/CardRegulation";
import { RegulationOptionsModal } from "../../components/regulations/RegulationOptionsModal";
import { Sidebar } from "../../components/Sidebar";
import {
  IRegulation,
  useRegulations,
} from "../../services/hooks/useRegulations";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

export default function RegulationList(): JSX.Element {
  const [regulationSelected, setRegulationSelected] = useState<IRegulation>(
    {} as IRegulation,
  );
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isActive, setIsActive] = useState(true);
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
        <Box flex="1" borderRadius={8}>
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

            {isWideVersion && (
              <>
                <Can accessLevel={accessLevel[3]}>
                  <Text>
                    Status:
                    <Switch
                      ml="2"
                      colorScheme="grayLigth"
                      isChecked={isActive}
                      onChange={() => {
                        setIsActive(!isActive);
                      }}
                    ></Switch>
                  </Text>
                </Can>
                <Search
                  placeholder="Filtrar regulamentos"
                  handleOnClick={setFilter}
                />
              </>
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

          {!isWideVersion && (
            <Flex mb="6" align="center" justify="center">
              <Can accessLevel={accessLevel[3]}>
                <Text>
                  Status:
                  <Switch
                    ml="2"
                    colorScheme="grayLigth"
                    isChecked={isActive}
                    onChange={() => {
                      setIsActive(!isActive);
                    }}
                  ></Switch>
                </Text>
              </Can>
              <Search
                placeholder="Filtrar regulamentos"
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
                <Text>Falha ao obter regulamentos.</Text>
              </Flex>
            ) : (
              <>
                <SimpleGrid
                  flex="1"
                  gap="4"
                  minChildWidth={[280, 340]}
                  align="flex-start"
                >
                  {data.regulations.map(regulation => {
                    return (
                      <Box
                        key={regulation.id}
                        onClick={() => {
                          onOpenModal(regulation);
                        }}
                      >
                        <CardRegulation
                          name={regulation.name}
                          inForceFrom={regulation.inForceFrom}
                          isActive={regulation.isActive}
                          createdAt={regulation.createdAt}
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
