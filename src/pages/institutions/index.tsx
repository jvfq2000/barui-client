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
} from "@chakra-ui/react";

import { Button } from "../../components/form/Button";
import { Switch } from "../../components/form/Switch";
import { Header } from "../../components/Header";
import { Search } from "../../components/Header/Search";
import { CardInstitution } from "../../components/institutions/CardInstitution";
import { InstitutionOptionsModal } from "../../components/institutions/InstitutionOptionsModal";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import {
  IInstitution,
  useInstitutions,
} from "../../services/hooks/useInstitutions";
import { withSSRAuth } from "../../shared/withSSRAuth";
import { accessLevel } from "../../utils/permitions";

export default function InstitutionList(): JSX.Element {
  const [institutionSelected, setInstitutionSelected] = useState<IInstitution>(
    {} as IInstitution,
  );
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [isActive, setIsActive] = useState(true);
  const { data, isLoading, isFetching, error } = useInstitutions({
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

  function onOpenModal(institution: IInstitution) {
    setInstitutionSelected(institution);
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
              Campus
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
                <Search placeholder="Filtrar campus" setSearch={setFilter} />
              </>
            )}

            <Link href="/institutions/create" passHref>
              <Button
                label="Criar novo"
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="green"
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
                <Text>Falha ao obter campus.</Text>
              </Flex>
            ) : (
              <>
                <SimpleGrid
                  flex="1"
                  gap="4"
                  minChildWidth={[280, 340]}
                  align="flex-start"
                >
                  {data.institutions.map(institution => {
                    return (
                      <Box
                        key={institution.id}
                        onClick={() => {
                          onOpenModal(institution);
                        }}
                      >
                        <CardInstitution
                          name={institution.name}
                          cityName={institution.cityName}
                          isActive={institution.isActive}
                          createdAt={institution.createdAt}
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
      <InstitutionOptionsModal
        institution={institutionSelected}
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
}, accessLevel[4]);

export { getServerSideProps };
