import { Box, Text, useColorMode } from "@chakra-ui/react";

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
  const { colorMode } = useColorMode();

  return (
    <Box
      h="100%"
      p={["2", "4"]}
      bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
      borderRadius={8}
      pb="4"
      _hover={{
        bg: colorMode === "dark" ? "grayDark.700" : "grayLight.700",
        cursor: "pointer",
      }}
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
