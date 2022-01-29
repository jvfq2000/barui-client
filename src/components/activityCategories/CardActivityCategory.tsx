import { Box, Text, useColorMode } from "@chakra-ui/react";

import { ItemCard } from "../ItemCard";

interface ICardActivityCategoryProps {
  name: string;
  isActive: boolean;
  createdAt: Date;
}

function CardActivityCategory({
  name,
  isActive,
  createdAt,
}: ICardActivityCategoryProps): JSX.Element {
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

      <ItemCard label="Cadastrado em" value={createdAt} />
      <ItemCard label="Status" value={isActive ? "Ativo" : "Inativo"} />
    </Box>
  );
}

export { CardActivityCategory };
