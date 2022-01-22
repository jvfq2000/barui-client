import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useColorMode,
} from "@chakra-ui/react";

interface IInputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  { name, label, error = null, ...rest },
  ref,
): JSX.Element => {
  const { colorMode } = useColorMode();

  return (
    <FormControl isInvalid={!!error}>
      {!!label && (
        <FormLabel htmlFor={name} id={`label-for-${name}`}>
          {label}
        </FormLabel>
      )}

      <ChakraInput
        name={name}
        id={name}
        focusBorderColor="green.500"
        bg={colorMode === "dark" ? "grayDark.900" : "grayLight.900"}
        variant="filled"
        _hover={{
          bg: colorMode === "dark" ? "grayDark.900" : "grayLight.900",
        }}
        size="lg"
        ref={ref}
        {...rest}
      />
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

const Input = forwardRef(InputBase);

export { Input };
