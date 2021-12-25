import { RiMenuLine } from "react-icons/ri";

import { Flex, useBreakpointValue, IconButton, Icon } from "@chakra-ui/react";

import { useSidebarDrawer } from "../../contexts/SidebarDrawerContext";
import { Logo } from "./Logo";
import { Profile } from "./Profile";

function Header(): JSX.Element {
  const { onOpen } = useSidebarDrawer();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });
  return (
    <Flex
      as="header"
      w="100%"
      maxW={1480}
      h="20"
      mx="auto"
      pt="4"
      px="6"
      align="center"
    >
      {!isWideVersion && (
        <IconButton
          aria-label="Open navigation"
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          mr="2"
        ></IconButton>
      )}

      <Logo />

      <Flex align="center" ml="auto">
        <Profile showProfileData={isWideVersion} />
      </Flex>
    </Flex>
  );
}

export { Header };
