import {
  Switch as ChakraSwitch,
  SwitchProps as ChakraSwitchProps,
  useColorMode,
  HStack,
  Text,
} from "@chakra-ui/react";

interface ISwitchProps extends ChakraSwitchProps {
  labelLeft: string;
  labelRight: string;
  isActive: boolean;
  setIsActive(active: boolean): void;
}

function Switch({
  labelLeft,
  labelRight,
  isActive,
  setIsActive,
  ...rest
}: ISwitchProps): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <HStack>
      <Text>{labelLeft}</Text>
      <ChakraSwitch
        colorScheme={colorMode === "light" ? "green" : "green2"}
        isChecked={isActive}
        onChange={() => {
          setIsActive(!isActive);
        }}
        {...rest}
      />
      <Text as="span">{labelRight}</Text>
    </HStack>
  );
}

export { Switch };
