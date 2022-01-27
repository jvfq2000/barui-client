import { useContext, useRef } from "react";
import {
  RiLogoutBoxLine,
  RiMoonLine,
  RiProfileLine,
  RiSunLine,
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
  Link,
  Icon,
  IconButton,
  useColorMode,
  Tooltip,
} from "@chakra-ui/react";

import { AuthContext, signOut } from "../../contexts/AuthContext";
import { Button } from "../form/Button";

interface IProfileProps {
  showProfileData: boolean;
}

function Profile({ showProfileData = true }: IProfileProps): JSX.Element {
  const { user } = useContext(AuthContext);
  const initialFocusRef = useRef();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Tooltip label="Alterar tema" hasArrow bg="gray.300" color="black">
        <IconButton
          mr="6"
          aria-label="grayDark.900"
          colorScheme="grayDark"
          size="sm"
          icon={<Icon as={colorMode === "dark" ? RiSunLine : RiMoonLine} />}
          onClick={toggleColorMode}
        />
      </Tooltip>
      <Popover
        id="propoverProfile"
        initialFocusRef={initialFocusRef}
        placement="bottom-end"
      >
        <PopoverTrigger>
          <Flex align="center" cursor="pointer">
            {showProfileData && (
              <Box mr="4" textAlign="center">
                <Text>{user?.name}</Text>
                <Text
                  color={
                    colorMode === "dark" ? "grayDark.300" : "grayLight.300"
                  }
                  fontSize="small"
                >
                  {user?.email}
                </Text>
                <Text
                  color={
                    colorMode === "dark" ? "grayDark.300" : "grayLight.300"
                  }
                  fontSize="small"
                >
                  {user?.accessLevel}
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
          color={colorMode === "dark" ? "grayDark.100" : "grayLight.100"}
          bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
          bordercolor={colorMode === "dark" ? "grayDark.600" : "grayLight.600"}
          maxW="200"
        >
          <PopoverHeader pt={4} fontWeight="bold" border="0">
            <Text>{user?.name}</Text>
            <Text
              color={colorMode === "dark" ? "grayDark.300" : "grayLight.300"}
              fontSize="small"
            >
              {user?.email}
            </Text>
            <Text
              color={colorMode === "dark" ? "grayDark.300" : "grayLight.300"}
              fontSize="small"
            >
              {user?.accessLevel}
            </Text>
          </PopoverHeader>

          <PopoverArrow
            bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
          />
          <PopoverCloseButton />

          <PopoverBody>
            <Link href="/users/profile">
              <Button
                label="Perfil"
                justifyContent="start"
                leftIcon={<Icon as={RiProfileLine} />}
                colorScheme={colorMode === "dark" ? "grayDark" : "grayLight"}
                variant="outline"
                w="100%"
                h="7"
                mb="2"
                _hover={{
                  bg: colorMode === "dark" ? "grayDark.600" : "grayLight.600",
                }}
              />
            </Link>
            <Button
              label="Sair"
              justifyContent="start"
              leftIcon={<Icon as={RiLogoutBoxLine} />}
              colorScheme={colorMode === "dark" ? "grayDark" : "grayLight"}
              variant="outline"
              w="100%"
              h="7"
              onClick={signOut}
              _hover={{
                bg: colorMode === "dark" ? "grayDark.600" : "grayLight.600",
              }}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

export { Profile };
