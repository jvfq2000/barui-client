import {
  RiContactsLine,
  RiDashboardLine,
  RiGitMergeLine,
  RiInputMethodLine,
} from "react-icons/ri";

import { VStack } from "@chakra-ui/react";

import { accessLevel } from "../../utils/permitions";
import { Can } from "../Can";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

function SidebarNav(): JSX.Element {
  return (
    <VStack spacing="12" align="flex-start">
      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">
          Dashboard
        </NavLink>
        <Can accessLevel={accessLevel[3]}>
          <NavLink icon={RiContactsLine} href="/users">
            Usuários
          </NavLink>
        </Can>
      </NavSection>

      <NavSection title="AUTOMAÇÃO">
        <NavLink icon={RiInputMethodLine} href="/forms">
          Formulários
        </NavLink>
        <NavLink icon={RiGitMergeLine} href="/automation">
          Automação
        </NavLink>
      </NavSection>
    </VStack>
  );
}

export { SidebarNav };
