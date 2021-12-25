import { Button } from "@chakra-ui/react";

interface IPaginationItemProps {
  number: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}

function PaginationItem({
  isCurrent = false,
  number,
  onPageChange,
}: IPaginationItemProps): JSX.Element {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="4"
        colorScheme="green"
        disabled
        _disabled={{ bg: "green.500", cursor: "default" }}
      >
        {number}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      fontSize="xs"
      width="4"
      bg="gray.700"
      _hover={{ bg: "gray.500" }}
      onClick={() => onPageChange(number)}
    >
      {number}
    </Button>
  );
}
export { PaginationItem };
