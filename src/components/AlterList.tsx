import { RiLayoutGridLine, RiLayoutMasonryLine } from "react-icons/ri";

import { Icon, IconButton, Tooltip } from "@chakra-ui/react";

interface IAlterListProps {
  listInTable: boolean;
  setListInTable(listInTable: boolean): void;
}

function AlterList({
  listInTable,
  setListInTable,
}: IAlterListProps): JSX.Element {
  return (
    <Tooltip
      label={listInTable ? "Listar em cards" : "Listar em tabela"}
      hasArrow
      bg="gray.300"
      color="black"
    >
      <IconButton
        aria-label="alterList"
        variant="unstyled"
        colorScheme="whiteAlpha"
        peddling="0"
        size="lg"
        icon={
          <Icon as={listInTable ? RiLayoutMasonryLine : RiLayoutGridLine} />
        }
        onClick={() => {
          setListInTable(!listInTable);
        }}
      />
    </Tooltip>
  );
}

export { AlterList };
