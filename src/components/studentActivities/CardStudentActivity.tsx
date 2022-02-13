import { Box, Text, useColorMode } from "@chakra-ui/react";

import { ItemCard } from "../ItemCard";

interface ICardStudentActivityProps {
  description: string;
  hours: number;
  semester: string;
  isCertified: boolean;
  approvedHours: number;
  isActive: boolean;
  createdAt: Date;
}

function CardStudentActivity({
  description,
  hours,
  semester,
  isCertified,
  approvedHours,
  isActive,
  createdAt,
}: ICardStudentActivityProps): JSX.Element {
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
        {description}
      </Text>

      <ItemCard label="Semestre" value={semester} />
      <ItemCard label="Comprovado" value={isCertified ? "Sim" : "Não"} />
      <ItemCard label="Qtd. horas" value={hours} />
      <ItemCard label="Qtd. horas aprovadas" value={approvedHours} />
      <ItemCard label="Cadastrado em" value={createdAt} />
      <ItemCard label="Status" value={isActive ? "Ativo" : "Inativo"} />
    </Box>
  );
}

export { CardStudentActivity };
