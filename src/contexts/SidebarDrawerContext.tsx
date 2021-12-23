import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect } from "react";

import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";

interface ISidebarDrawerProviderProps {
  children: ReactNode;
}

type SidebarDeawerContextData = UseDisclosureReturn;

const SidebarDrawerContext = createContext({} as SidebarDeawerContextData);

function SidebarDrawerProvider({
  children,
}: ISidebarDrawerProviderProps): JSX.Element {
  const disclosure = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    disclosure.onClose();
  }, [router.asPath]);

  return (
    <SidebarDrawerContext.Provider value={disclosure}>
      {children}
    </SidebarDrawerContext.Provider>
  );
}

const useSidebarDrawer = () => useContext(SidebarDrawerContext);

export { SidebarDrawerProvider, useSidebarDrawer };
