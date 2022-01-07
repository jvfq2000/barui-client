import { Box, HStack, Text } from "@chakra-ui/react";

interface ICardInstitutionProps {
  name: string;
  cityName: string;
  isActive: boolean;
  createdAt: string;
}

function CardInstitution({
  name,
  cityName,
  isActive,
  createdAt,
}: ICardInstitutionProps): JSX.Element {
  return (
    <Box
      p={["6", "8"]}
      bg="gray.800"
      borderRadius={8}
      pb="4"
      _hover={{ bg: "gray.700", cursor: "pointer" }}
    >
      <Text mb="4" align="center" fontSize="lg" fontWeight="bold">
        {name}
      </Text>

      <HStack>
        <Text fontSize="sm">Cidade:</Text>
        <Text fontSize="sm" color="gray.300">
          {cityName}
        </Text>
      </HStack>

      <HStack>
        <Text fontSize="sm">Cadastrado em:</Text>
        <Text fontSize="sm" color="gray.300">
          {createdAt}
        </Text>
      </HStack>

      <HStack>
        <Text fontSize="sm">Status:</Text>
        <Text
          fontSize="sm"
          fontWeight="bold"
          color={isActive ? "green.500" : "red.700"}
        >
          {isActive ? "Ativo" : "Inativo"}
        </Text>
      </HStack>
    </Box>
  );
}

export { CardInstitution };
