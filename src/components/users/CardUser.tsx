import { Avatar, Box, HStack, Text, useColorMode } from "@chakra-ui/react";

import { ItemCard } from "../ItemCard";

interface ICardUserProps {
  name: string;
  lastName: string;
  email: string;
  avatar: string;
  avatarUrl: string;
  isActive: boolean;
  accessLevel: string;
  createdAt: Date;
}

function CardUser({
  name,
  lastName,
  email,
  avatar,
  avatarUrl,
  accessLevel,
  isActive,
  createdAt,
}: ICardUserProps): JSX.Element {
  const { colorMode } = useColorMode();

  let accessLevelFormat = accessLevel;

  if (accessLevel === "administrador geral") {
    accessLevelFormat = "adm. geral";
  } else if (accessLevel === "administrador do campus") {
    accessLevelFormat = "adm. campus";
  } else if (accessLevel === "coordenador de curso") {
    accessLevelFormat = "coor. curso";
  } else if (accessLevel === "coordenador de atividades") {
    accessLevelFormat = "coor. ativ.";
  }

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
      <HStack mb="4" justify="space-between">
        <Avatar size="lg" name={name} src={avatar && avatarUrl} />
        <Text align="center" fontSize="md">
          {name}
        </Text>
        <Text fontSize="md">
          {accessLevelFormat[0].toUpperCase() + accessLevelFormat.substring(1)}
        </Text>
      </HStack>

      <ItemCard label="Nome completo" value={`${name} ${lastName}`} />
      <ItemCard label="E-mail" value={email} />
      <ItemCard label="Cadastrado em" value={createdAt} />
      <ItemCard label="Status" value={isActive ? "Ativo" : "Inativo"} />
    </Box>
  );
}

export { CardUser };
