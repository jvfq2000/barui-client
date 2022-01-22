import { ReactNode } from "react";

import { Text, Box, VStack, useColorMode } from "@chakra-ui/react";

interface INavSectionProps {
  title: string;
  children: ReactNode;
}

function NavSection({ title, children }: INavSectionProps): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <Box>
      <Text
        fontWeight="bould"
        color={colorMode === "dark" ? "grayDark.400" : "grayLight.400"}
        fontSize="small"
      >
        {title}
      </Text>
      <VStack spacing="2" mt="4" align="stretch">
        {children}
      </VStack>
    </Box>
  );
}

export { NavSection };
