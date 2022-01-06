import { useContext, useRef } from "react";
import {
  RiGitMergeLine,
  RiInputMethodLine,
  RiLogoutBoxLine,
  RiLogoutBoxRFill,
  RiLogoutBoxRLine,
  RiProfileFill,
  RiProfileLine,
} from "react-icons/ri";

import {
  Flex,
  Text,
  Box,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  Button,
  Link,
  Icon,
} from "@chakra-ui/react";

import { AuthContext, signOut } from "../../contexts/AuthContext";
import { NavLink } from "../Sidebar/NavLink";

interface IProfileProps {
  showProfileData: boolean;
}

function Profile({ showProfileData = true }: IProfileProps): JSX.Element {
  const { user } = useContext(AuthContext);
  const initialFocusRef = useRef();

  return (
    <Popover initialFocusRef={initialFocusRef} placement="bottom-end">
      <PopoverTrigger>
        <Flex align="center" cursor="pointer">
          {showProfileData && (
            <Box mr="4" textAlign="center">
              <Text>{user?.name}</Text>
              <Text color="gray.300" fontSize="small">
                {user?.email}
              </Text>
            </Box>
          )}

          <Avatar
            size="md"
            name={user?.name}
            src={user?.avatar && user?.avatarUrl}
          />
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        color="gray.100"
        bg="gray.800"
        borderColor="gray.600"
        maxW="200"
      >
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          <Text>{user?.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user?.email}
          </Text>
        </PopoverHeader>

        <PopoverArrow bg="gray.800" />
        <PopoverCloseButton />

        <PopoverBody>
          <Link href="/users/profile">
            <Button
              justifyContent="start"
              leftIcon={<Icon as={RiProfileLine} />}
              colorScheme="gray"
              variant="outline"
              w="100%"
              h="7"
              mb="2"
              _hover={{ color: "gray.800", bg: "gray.100" }}
            >
              Perfil
            </Button>
          </Link>
          <Button
            justifyContent="start"
            leftIcon={<Icon as={RiLogoutBoxLine} />}
            colorScheme="gray"
            variant="outline"
            w="100%"
            h="7"
            onClick={signOut}
            _hover={{ color: "gray.800", bg: "gray.100" }}
          >
            Sair
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export { Profile };
