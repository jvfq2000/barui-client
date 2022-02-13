import {
  RiBookMarkLine,
  RiBuilding2Line,
  RiContactsLine,
  RiDashboardLine,
  RiFileList2Line,
  RiPriceTag3Line,
  RiTableLine,
  RiTimerFlashLine,
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
          Painel
        </NavLink>
      </NavSection>

      <Can accessLevel={accessLevel[3]}>
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
            <NavLink icon={RiContactsLine} href="/users">
              Usuários
            </NavLink>
          </Can>
        </NavSection>
      </Can>

      <NavSection title="ATIVIDADES">
        <NavLink icon={RiTimerFlashLine} href="/student-activities">
          Atividades
        </NavLink>
        <Can accessLevel={accessLevel[3]}>
          <NavLink icon={RiPriceTag3Line} href="/activity-categories">
            Cat. Atividades
          </NavLink>
        </Can>
        <Can accessLevel={accessLevel[3]}>
          <NavLink icon={RiTableLine} href="/charts">
            Quadros
          </NavLink>
        </Can>
        <NavLink icon={RiFileList2Line} href="/regulations">
          Regulamentos
        </NavLink>
      </NavSection>
    </VStack>
  );
}

export { SidebarNav };
