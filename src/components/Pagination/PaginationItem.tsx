import { useColorMode } from "@chakra-ui/react";

import { Button } from "../form/Button";

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
  const { colorMode } = useColorMode();

  if (isCurrent) {
    return (
      <Button
        label={`${number}`}
        size="sm"
        fontSize="xs"
        width="4"
        colorScheme="green"
        disabled
        _disabled={{ bg: "green.500", cursor: "default" }}
      />
    );
  }

  return (
    <Button
      label={`${number}`}
      size="sm"
      fontSize="xs"
      width="4"
      bg={colorMode === "dark" ? "grayDark.700" : "grayLight.700"}
      _hover={{ bg: colorMode === "dark" ? "grayDark.500" : "grayLight.500" }}
      onClick={() => onPageChange(number)}
    />
  );
}
export { PaginationItem };
