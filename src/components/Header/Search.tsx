import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";

import { Flex, Input, Icon, IconButton } from "@chakra-ui/react";

interface ISearchProps {
  handleOnClick: (value: string) => void;
  placeholder?: string;
}

function Search({
  handleOnClick,
  placeholder = "buscar",
}: ISearchProps): JSX.Element {
  const [search, setSearch] = useState("");

  return (
    <Flex
      as="label"
      flex="1"
      py="1"
      px="2"
      mx={[2, 6]}
      maxW={400}
      alignSelf="center"
      color="gray.200"
      position="relative"
      bg="gray.800"
      borderRadius="full"
    >
      <Input
        color="gray.50"
        variant="unstyled"
        placeholder={placeholder}
        _placeholder={{
          color: "gray.400",
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
