import { Box, Link, Text, useColorMode } from "@chakra-ui/react";

import { accessLevel } from "../../utils/permitions";
import { ItemCard } from "../ItemCard";

interface ICardRegulationProps {
  name: string;
  inForceFrom: string;
  isActive: boolean;
  createdAt: Date;
  userAccessLevel: string;
  fileUrl: string;
}

function CardRegulation({
  userAccessLevel,
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
        userAccessLevel !== accessLevel[0]
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
      {userAccessLevel !== accessLevel[0] && (
        <ItemCard label="Status" value={isActive ? "Ativo" : "Inativo"} />
      )}
      {userAccessLevel === accessLevel[0] && (
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
