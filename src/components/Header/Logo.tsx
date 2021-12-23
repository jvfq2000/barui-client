import { Text } from "@chakra-ui/react";

function Logo(): JSX.Element {
  return (
    <Text
      fontSize={["2xl", "3xl"]}
      fontWeight="bold"
      letterSpacing="tight"
      w="64"
    >
      BaseCliente
      <Text as="span" color="pink.500" ml="1">
        .
      </Text>
    </Text>
  );
}

export { Logo };
