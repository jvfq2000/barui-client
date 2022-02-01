import { Box, Text, useColorMode } from "@chakra-ui/react";

import { ItemCard } from "../ItemCard";

interface ICardActivityProps {
  name: string;
  maxHours: number;
  minHours: number;
  showHover?: boolean;
  isActive?: boolean;
  createdAt?: Date;
}

function CardActivity({
  name,
  maxHours,
  minHours,
  isActive,
  createdAt,
  showHover = true,
}: ICardActivityProps): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <Box
      h="100%"
      p={["2", "4"]}
      bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
      borderRadius={8}
      border="1px solid"
      borderColor={colorMode === "dark" ? "grayDark.700" : "grayLight.700"}
      pb="4"
      _hover={
        showHover
          ? {
              bg: colorMode === "dark" ? "grayDark.700" : "grayLight.700",
              cursor: "pointer",
            }
          : {}
      }
    >
      <Text mb="4" align="center" fontSize="md">
        {name}
      </Text>

      <ItemCard label="Carga hor. mín." value={`${minHours} horas`} />
      <ItemCard label="Carga hor. máx." value={`${maxHours} horas`} />
      {createdAt && <ItemCard label="Cadastrado em" value={createdAt} />}
      {isActive !== null && isActive !== undefined && (
        <ItemCard label="Status" value={isActive ? "Ativo" : "Inativo"} />
      )}
    </Box>
  );
}

export { CardActivity };
