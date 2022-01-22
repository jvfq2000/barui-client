import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";

import { Flex, Input, Icon, IconButton, useColorMode } from "@chakra-ui/react";

interface ISearchProps {
  handleOnClick: (value: string) => void;
  placeholder?: string;
}

function Search({
  handleOnClick,
  placeholder = "buscar",
}: ISearchProps): JSX.Element {
  const [search, setSearch] = useState("");
  const { colorMode } = useColorMode();

  return (
    <Flex
      as="label"
      flex="1"
      py="1"
      px="2"
      mx={[2, 6]}
      maxW={400}
      alignSelf="center"
      color={colorMode === "dark" ? "grayDark.200" : "grayLight.200"}
      position="relative"
      bg={colorMode === "dark" ? "grayDark.800" : "grayLight.800"}
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
      <IconButton
        aria-label="Open navigation"
        variant="unstyled"
        icon={<Icon as={RiSearchLine} />}
        onClick={() => {
          handleOnClick(search);
        }}
      />
    </Flex>
  );
}

export { Search };
