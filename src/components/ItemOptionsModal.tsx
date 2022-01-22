import { HStack, Text, useColorMode } from "@chakra-ui/react";

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
    <HStack>
      <Text fontSize="lg">{label}:</Text>
      <Text
        fontSize="lg"
        color={colorMode === "dark" ? "grayDark.300" : "grayLight.300"}
      >
        {value}
      </Text>
    </HStack>
  );
}

export { ItemOptionsModal };
