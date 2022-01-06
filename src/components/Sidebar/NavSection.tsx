import { ReactNode } from "react";

import { Text, Box, VStack } from "@chakra-ui/react";

interface INavSectionProps {
  title: string;
  children: ReactNode;
}

function NavSection({ title, children }: INavSectionProps): JSX.Element {
  return (
    <Box>
      <Text fontWeight="bould" color="gray.400" fontSize="small">
        {title}
      </Text>
      <VStack spacing="2" mt="4" align="stretch">
        {children}
      </VStack>
    </Box>
  );
}

export { NavSection };
