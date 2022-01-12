import { HStack, Stack, Box, Text } from "@chakra-ui/react";

import { PaginationItem } from "./PaginationItem";

interface IPaginationProps {
  totalCountOfRegisters: number;
  registersPerPage?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

const siblingsCount = 2;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1;
    })
    .filter(page => page > 0);
}

function Pagination({
  totalCountOfRegisters,
  registersPerPage = 12,
  currentPage = 1,
  onPageChange,
}: IPaginationProps): JSX.Element {
  let lastPage = Math.floor(totalCountOfRegisters / registersPerPage);
  const lastItemOfPage =
    (currentPage - 1) * registersPerPage + registersPerPage;

  if (totalCountOfRegisters / registersPerPage > lastPage) {
    lastPage += 1;
  }

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage),
        )
      : [];

  return (
    <>
      {totalCountOfRegisters > 0 ? (
        <Stack
          direction={["column", "row"]}
          spacing="6"
          mt="8"
          justify="space-between"
        >
          <Box alignSelf="center">
            <strong>{(currentPage - 1) * registersPerPage + 1}</strong> -{" "}
            <strong>
              {lastItemOfPage < totalCountOfRegisters
                ? lastItemOfPage
                : totalCountOfRegisters}
            </strong>{" "}
            de <strong>{totalCountOfRegisters}</strong>
          </Box>
          <HStack spacing="2" justify="center">
            {currentPage > 1 + siblingsCount && (
              <>
                <PaginationItem onPageChange={onPageChange} number={1} />
                {currentPage > 2 + siblingsCount && (
                  <Text color="gray.300" w="8" textAlign="center">
                    ...
                  </Text>
                )}
              </>
            )}

            {previousPages.length > 0 &&
              previousPages.map(page => {
                return (
                  <PaginationItem
                    key={page}
                    onPageChange={onPageChange}
                    number={page}
                  />
                );
              })}

            <PaginationItem
              onPageChange={onPageChange}
              number={currentPage}
              isCurrent
            />

            {nextPages.length > 0 &&
              nextPages.map(page => {
                return (
                  <PaginationItem
                    key={page}
                    onPageChange={onPageChange}
                    number={page}
                  />
                );
              })}

            {siblingsCount + currentPage < lastPage && (
              <>
                {lastPage > 1 + siblingsCount + currentPage && (
                  <Text color="gray.300" w="8" textAlign="center">
                    ...
                  </Text>
                )}
                <PaginationItem onPageChange={onPageChange} number={lastPage} />
              </>
            )}
          </HStack>
        </Stack>
      ) : (
        <Text mt="8">Nenhum registro encontrado</Text>
      )}
    </>
  );
}

export { Pagination };
