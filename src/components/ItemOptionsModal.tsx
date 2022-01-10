import { HStack, Text } from "@chakra-ui/react";

interface IItemOptionsModalProps {
  label: string;
  value: any;
}

function ItemOptionsModal({
  label,
  value,
}: IItemOptionsModalProps): JSX.Element {
  return (
    <HStack>
      <Text fontSize="lg">{label}:</Text>
      <Text fontSize="lg" color="gray.300">
        {value}
      </Text>
    </HStack>
  );
}

export { ItemOptionsModal };
