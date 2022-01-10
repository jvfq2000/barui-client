import {
  RiBookMarkLine,
  RiBuilding2Line,
  RiContactsLine,
  RiDashboardLine,
} from "react-icons/ri";

import { VStack } from "@chakra-ui/react";

import { accessLevel } from "../../utils/permitions";
import { Can } from "../Can";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

function SidebarNav(): JSX.Element {
  return (
    <VStack spacing="12" align="flex-start" borderColor="gray.300">
      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">
          Dashboard
        </NavLink>
      </NavSection>

      <NavSection title="ADMINISTRAÇÃO">
        <Can accessLevel={accessLevel[4]}>
          <NavLink icon={RiBuilding2Line} href="/institutions">
            Campus
          </NavLink>
        </Can>
        <Can accessLevel={accessLevel[3]}>
          <NavLink icon={RiBookMarkLine} href="/courses">
            Cursos
          </NavLink>
        </Can>
        <Can accessLevel={accessLevel[3]}>
          <NavLink icon={RiContactsLine} href="/users">
            Usuários
          </NavLink>
        </Can>
      </NavSection>
    </VStack>
  );
}

export { SidebarNav };
