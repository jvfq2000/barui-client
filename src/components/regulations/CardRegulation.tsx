import { Box, Text } from "@chakra-ui/react";

import { ItemCard } from "../ItemCard";

interface ICardRegulationProps {
  name: string;
  inForceFrom: string;
  isActive: boolean;
  createdAt: Date;
}

function CardRegulation({
  name,
  inForceFrom,
  isActive,
  createdAt,
}: ICardRegulationProps): JSX.Element {
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

      <ItemCard label="Em vigor a partir de" value={inForceFrom} />
      <ItemCard label="Cadastrado em" value={createdAt} />
      <ItemCard label="Status" value={isActive ? "Ativo" : "Inativo"} />
    </Box>
  );
}

export { CardRegulation };
