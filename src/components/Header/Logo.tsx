import { Link, Text } from "@chakra-ui/react";

function Logo(): JSX.Element {
  return (
    <Text
      fontSize={["2xl", "3xl"]}
      fontWeight="bold"
      letterSpacing="tight"
      w="64"
    >
      <Link href="/">
        Baru
        <Text as="span" color="green.500">
          í
        </Text>
      </Link>
    </Text>
  );
}

export { Logo };
