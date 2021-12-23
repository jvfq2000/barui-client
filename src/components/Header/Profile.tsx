import { useContext } from "react";

import { Flex, Text, Box, Avatar } from "@chakra-ui/react";

import { AuthContext } from "../../contexts/AuthContext";

interface IProfileProps {
  showProfileData: boolean;
}

function Profile({ showProfileData = true }: IProfileProps): JSX.Element {
  const { user } = useContext(AuthContext);

  return (
    <Flex align="center">
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
  );
}

export { Profile };
