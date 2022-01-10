import { Box, Text } from "@chakra-ui/react";

import { ItemCard } from "../ItemCard";

interface ICardInstitutionProps {
  name: string;
  cityName: string;
  isActive: boolean;
  createdAt: Date;
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
      <Text mb="4" align="center" fontSize="md">
        {name}
      </Text>

      <ItemCard label="Cidade" value={cityName} />
      <ItemCard label="Cadastrado em" value={createdAt} />
      <ItemCard label="Status" value={isActive ? "Ativo" : "Inativo"} />
    </Box>
  );
}

export { CardInstitution };
