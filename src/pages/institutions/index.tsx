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
} from "@chakra-ui/react";

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

export default function institutionList(): JSX.Element {
  const [institutionSelected, setInstitutionSelected] = useState<IInstitution>(
    {} as IInstitution,
  );
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const { data, isLoading, isFetching, error } = useInstitutions({
    page,
    filter,
  });

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
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>

            {isWideVersion && (
              <Search placeholder="Filtrar campus" handleOnClick={setFilter} />
            )}

            <Link href="/institutions/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="green"
                leftIcon={<Icon as={RiAddCircleLine} fontSize="20" />}
              >
                Criar novo
              </Button>
            </Link>
          </Flex>

          {!isWideVersion && (
            <Box mb="6" align="center">
              <Search placeholder="Filtrar campus" handleOnClick={setFilter} />
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
                <Text>Falha ao obter dados dos campus.</Text>
              </Flex>
            ) : (
              <>
                <SimpleGrid
                  flex="1"
                  gap="4"
                  minChildWidth={[280, 320]}
                  aling="flex-start"
                >
                  {data.institutions.map(institution => {
                    return (
                      <Box
                        onClick={() => {
                          onOpenModal(institution);
                        }}
                      >
                        <CardInstitution
                          key={institution.id}
                          name={institution.name}
                          cityName={institution.city.name}
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
      ></InstitutionOptionsModal>
    </Box>
  );
}

const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
}, accessLevel[4]);

export { getServerSideProps };
