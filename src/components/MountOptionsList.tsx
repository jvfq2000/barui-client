import { useBreakpointValue } from "@chakra-ui/react";

import { AlterList } from "./AlterList";
import { Switch } from "./form/Switch";
import { Search } from "./Header/Search";

interface IMountOptionsListProps {
  listInTable: boolean;
  setListInTable(listInTable: boolean): void;
  isActive?: boolean;
  setIsActive?(isActive: boolean): void;
  labelFilter: string;
  setFilter(filter: string): void;
}

function MountOptionsList({
  listInTable,
  setListInTable,
  isActive,
  setIsActive,
  labelFilter,
  setFilter,
}: IMountOptionsListProps): JSX.Element {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <>
      {isWideVersion && (
        <AlterList listInTable={listInTable} setListInTable={setListInTable} />
      )}
      {(isActive === true || isActive === false) && (
        <Switch
          labelLeft="Inativos"
          labelRight="Ativos"
          isActive={isActive}
          setIsActive={setIsActive}
        />
      )}
      <Search placeholder={labelFilter} setSearch={setFilter} />
    </>
  );
}

export { MountOptionsList };
