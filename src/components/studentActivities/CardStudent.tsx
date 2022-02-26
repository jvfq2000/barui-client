import { Avatar, Box, HStack, Text, useColorMode } from "@chakra-ui/react";

import { ItemCard } from "../ItemCard";

interface ICardStudentProps {
  userName: string;
  avatar: string;
  avatarUrl: string;
  initialSemester: string;
  registeredHours: number;
  approvedHours: number;
  rejectedHours: number;
  hoursNotAnalyzed: number;
}

function CardStudent({
  userName,
  avatar,
  avatarUrl,
  initialSemester,
  registeredHours,
  approvedHours,
  rejectedHours,
  hoursNotAnalyzed,
}: ICardStudentProps): JSX.Element {
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
      <HStack mb="4">
        <Avatar size="lg" name={userName} src={avatar && avatarUrl} />
        <Text align="center" fontSize="md">
          {userName}
        </Text>
      </HStack>

      <ItemCard label="Primeiro semestre" value={initialSemester} />
      <ItemCard label="Horas cadastradas" value={registeredHours} />
      <ItemCard label="Horas deferidas" value={approvedHours} />
      <ItemCard label="Horas indeferidas" value={rejectedHours} />
      <ItemCard label="Horas em análise" value={hoursNotAnalyzed} />
    </Box>
  );
}

export { CardStudent };
