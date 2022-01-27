import { Text, useColorMode } from "@chakra-ui/react";

interface IItemOptionsModalProps {
  label: string;
  value: any;
}

function ItemOptionsModal({
  label,
  value,
}: IItemOptionsModalProps): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <Text fontSize="lg">
      {label}:
      <Text
        as="span"
        ml="1"
        fontSize="lg"
        color={colorMode === "dark" ? "grayDark.300" : "grayLight.300"}
      >
        {value}
      </Text>
    </Text>
  );
}

export { ItemOptionsModal };
