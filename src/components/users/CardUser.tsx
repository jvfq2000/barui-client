import { Avatar, Box, HStack, Text } from "@chakra-ui/react";

interface ICardUserProps {
  name: string;
  lastName: string;
  email: string;
  accessLevel: string;
  avatar: string;
  avatarUrl: string;
  createdAt: string;
  isActive: boolean;
}

function CardUser({
  name,
  lastName,
  email,
  accessLevel,
  avatar,
  avatarUrl,
  createdAt,
  isActive,
}: ICardUserProps): JSX.Element {
  let accessLevelFormat = accessLevel;

  if (accessLevel === "administrador geral") {
    accessLevelFormat = "admin. geral";
  } else if (accessLevel === "administrador do campus") {
    accessLevelFormat = "admin.";
  } else if (accessLevel === "coordenador de curso") {
    accessLevelFormat = "coor. curso";
  } else if (accessLevel === "coordenador de atividades") {
    accessLevelFormat = "coor. ativ.";
  }

  return (
    <Box
      p={["6", "8"]}
      bg="gray.800"
      borderRadius={8}
      pb="4"
      _hover={{ bg: "gray.700", cursor: "pointer" }}
    >
      <HStack mb="4" justify="space-between">
        <Avatar size="md" name={name} src={avatar && avatarUrl} />
        <Text fontSize="lg" fontWeight="bold">
          {name}
        </Text>
        <Text fontSize="lg">
          {accessLevelFormat[0].toUpperCase() + accessLevelFormat.substring(1)}
        </Text>
      </HStack>

      <HStack>
        <Text fontSize="sm">Nome completo:</Text>
        <Text fontSize="sm" color="gray.300">{`${name} ${lastName}`}</Text>
      </HStack>

      <HStack>
        <Text fontSize="sm">E-mail:</Text>
        <Text fontSize="sm" color="gray.300">
          {email}
        </Text>
      </HStack>

      <HStack>
        <Text fontSize="sm">Data de cadastro:</Text>
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

export { CardUser };
