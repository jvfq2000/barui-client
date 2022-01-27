import React from "react";

import {
  Box,
  Drawer,
  useBreakpointValue,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerOverlay,
  useColorMode,
} from "@chakra-ui/react";

import { useSidebarDrawer } from "../../contexts/SidebarDrawerContext";
import { SidebarNav } from "./SidebarNav";

function Sidebar(): JSX.Element {
  const { isOpen, onClose } = useSidebarDrawer();
  const { colorMode } = useColorMode();

  const isDrawerSidebar = useBreakpointValue({
    base: true,
    lg: false,
  });

  if (isDrawerSidebar) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent
            bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
            p="4"
          >
            <DrawerCloseButton mt="6" />
            <DrawerHeader>Navegação</DrawerHeader>

            <DrawerBody>
              <SidebarNav />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    );
  }

  return (
    <Box as="aside" w="48">
      <SidebarNav />
    </Box>
  );
}

export { Sidebar };
