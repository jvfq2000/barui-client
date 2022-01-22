import { Box, Text, useColorMode } from "@chakra-ui/react";

import { ItemCard } from "../ItemCard";

interface ICardActivityProps {
  name: string;
  maxHours: number;
  minHours: number;
  isActive: boolean;
  createdAt: Date;
  categoryName: string;
}

function CardActivity({
  name,
  maxHours,
  minHours,
  isActive,
  createdAt,
  categoryName,
}: ICardActivityProps): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <Box
      p={["6", "8"]}
      bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
      borderRadius={8}
      border="1px solid #353646"
      pb="4"
      _hover={{
        bg: colorMode === "dark" ? "grayDark.700" : "grayLight.700",
        cursor: "pointer",
      }}
    >
      <Text mb="4" align="center" fontSize="md">
        {name}
      </Text>

      <ItemCard label="Carga hor. max." value={`${maxHours} horas`} />
      <ItemCard label="Carga hor. min." value={`${minHours} horas`} />
      <ItemCard label="Categoria" value={categoryName} />
      <ItemCard label="Cadastrado em" value={createdAt} />
      <ItemCard label="Status" value={isActive ? "Ativo" : "Inativo"} />
    </Box>
  );
}

export { CardActivity };
