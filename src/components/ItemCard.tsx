/* eslint-disable no-nested-ternary */
import { HStack, Text } from "@chakra-ui/react";

interface IItemCardProps {
  label: string;
  value: any;
}

function ItemCard({ label, value }: IItemCardProps): JSX.Element {
  return (
    <HStack>
      <Text fontSize="sm">{label}:</Text>
      <Text
        fontSize="sm"
        fontWeight={label === "Status" ? "bold" : "normal"}
        color={
          label !== "Status"
            ? "gray.300"
            : value === "Ativo"
            ? "green.500"
            : "red.700"
        }
      >
        {value}
      </Text>
    </HStack>
  );
}

export { ItemCard };
