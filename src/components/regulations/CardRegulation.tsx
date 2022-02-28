import { Box, Link, Text, useColorMode } from "@chakra-ui/react";

import { useCan } from "../../services/hooks/useCan";
import { accessLevel } from "../../utils/permitions";
import { ItemCard } from "../ItemCard";

interface ICardRegulationProps {
  name: string;
  inForceFrom: string;
  isActive: boolean;
  createdAt: Date;
  fileUrl: string;
}

function CardRegulation({
  name,
  inForceFrom,
  isActive,
  createdAt,
  fileUrl,
}: ICardRegulationProps): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <Box
      h="100%"
      p={["2", "4"]}
      bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
      borderRadius={8}
      pb="4"
      _hover={
        useCan(accessLevel[2])
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

      <ItemCard label="Em vigor a partir de" value={inForceFrom} />
      <ItemCard label="Cadastrado em" value={createdAt} />
      {useCan(accessLevel[2]) && (
        <ItemCard label="Status" value={isActive ? "Ativo" : "Inativo"} />
      )}
      {!useCan(accessLevel[2]) && (
        <Link href={fileUrl} isExternal>
          <Text mt="2" fontSize="md" color="green.500">
            Download
          </Text>
        </Link>
      )}
    </Box>
  );
}

export { CardRegulation };
