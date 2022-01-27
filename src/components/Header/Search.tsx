import { Flex, Input, useColorMode } from "@chakra-ui/react";

interface ISearchProps {
  setSearch(value: string): void;
  placeholder?: string;
}

function Search({
  setSearch,
  placeholder = "buscar",
}: ISearchProps): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <Flex
      as="label"
      flex="1"
      py="3"
      px="2"
      mx={[2, 6]}
      maxW={400}
      alignSelf="center"
      color={colorMode === "dark" ? "grayDark.200" : "grayLight.200"}
      position="relative"
      bg={colorMode === "dark" ? "grayDark.900" : "grayLight.900"}
      borderRadius="full"
    >
      <Input
        color={colorMode === "dark" ? "grayDark.50" : "grayLight.50"}
        variant="unstyled"
        placeholder={placeholder}
        _placeholder={{
          color: "grayDark.400",
        }}
        onChange={event => {
          setSearch(event.target.value);
        }}
        px="4"
        mr="4"
      />
    </Flex>
  );
}

export { Search };
