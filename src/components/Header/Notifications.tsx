import {
  RiLogoutBoxLine,
  RiNotificationLine,
  RiProfileLine,
} from "react-icons/ri";

import { HStack, Icon, IconButton, Link, Tooltip } from "@chakra-ui/react";

import { signOut } from "../../contexts/AuthContext";

function Notifications(): JSX.Element {
  return (
    <HStack
      spacing="0"
      mx={["2", "4"]}
      color="gray.300"
      borderRightWidth={1}
      borderColor="gray.700"
    >
      <Tooltip label="Perfil">
        <Link href="/users/profile">
          <IconButton
            aria-label="Open navigation"
            icon={<Icon as={RiProfileLine} />}
            fontSize="20"
            variant="unstyled"
          ></IconButton>
        </Link>
      </Tooltip>
      <Tooltip label="Sair do sistema">
        <IconButton
          aria-label="Open navigation"
          icon={<Icon as={RiLogoutBoxLine} />}
          fontSize="20"
          variant="unstyled"
          onClick={signOut}
        ></IconButton>
      </Tooltip>
    </HStack>
  );
}

export { Notifications };
