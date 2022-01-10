import { Box, Text } from "@chakra-ui/react";

import { ItemCard } from "../ItemCard";

interface ICardCourseProps {
  name: string;
  numberPeriods: number;
  isActive: boolean;
  createdAt: Date;
}

function CardCourse({
  name,
  numberPeriods,
  isActive,
  createdAt,
}: ICardCourseProps): JSX.Element {
  return (
    <Box
      p={["6", "8"]}
      bg="gray.800"
      borderRadius={8}
      pb="4"
      _hover={{ bg: "gray.700", cursor: "pointer" }}
    >
      <Text mb="4" align="center" fontSize="md">
        {name}
      </Text>

      <ItemCard label="Duração" value={`${numberPeriods} períodos`} />
      <ItemCard label="Cadastrado em" value={createdAt} />
      <ItemCard label="Status" value={isActive ? "Ativo" : "Inativo"} />
    </Box>
  );
}

export { CardCourse };
