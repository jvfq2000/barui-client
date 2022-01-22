import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";
import ReactInputMask, { Props } from "react-input-mask";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputProps,
  useColorMode,
} from "@chakra-ui/react";

interface IInputMaskProps extends InputProps {
  name: string;
  mask: string;
  maskChar: string;
  label?: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInputMaskProps> = (
  { name, mask, maskChar, label, error = null, ...rest },
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

      <Input
        as={ReactInputMask}
        name={name}
        id={name}
        mask={mask}
        maskChar={maskChar}
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

const InputMask = forwardRef(InputBase);

export { InputMask };
