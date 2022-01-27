/* eslint-disable no-nested-ternary */
import { Text, useColorMode } from "@chakra-ui/react";

interface IItemCardProps {
  label: string;
  value: any;
}

function ItemCard({ label, value }: IItemCardProps): JSX.Element {
  const { colorMode } = useColorMode();
  const defaultColor = colorMode === "dark" ? "grayDark.300" : "grayLight.300";

  return (
    <Text fontSize="sm">
      {label}:
      <Text
        as="span"
        ml="1"
        fontSize="sm"
        fontWeight={label === "Status" ? "bold" : "normal"}
        color={
          label !== "Status"
            ? defaultColor
            : value === "Ativo"
            ? "green.500"
            : "red.700"
        }
      >
        {value}
      </Text>
    </Text>
  );
}

export { ItemCard };
