import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  useColorMode,
} from "@chakra-ui/react";

import { Button } from "./Button";

interface IInputFileProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  showButtonUpload?: boolean;
  handleButtonUpload?: () => void;
  labelBotton?: string;
  isLoadingButton?: boolean;
  fileSelected?: boolean;
}

const InputFileBase: ForwardRefRenderFunction<
  HTMLInputElement,
  IInputFileProps
> = (
  {
    name,
    label,
    showButtonUpload,
    handleButtonUpload,
    labelBotton,
    isLoadingButton,
    fileSelected,
    error = null,
    ...rest
  },
  ref,
): JSX.Element => {
  const { colorMode } = useColorMode();

  return (
    <Flex>
      <FormControl isInvalid={!!error}>
        {!!label && (
          <FormLabel
            borderRadius="5"
            border="1px solid green"
            p="3"
            h="47px"
            bg={colorMode === "dark" ? "grayDark.900" : "grayLight.900"}
            htmlFor={name}
            id={`label-for-${name}`}
            _hover={{
              bg: colorMode === "dark" ? "grayDark.800" : "grayLight.800",
              cursor: "pointer",
            }}
          >
            {label}
          </FormLabel>
        )}

        <ChakraInput
          display="none"
          name={name}
          id={name}
          type="file"
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

      {showButtonUpload && (
        <Button
          label={labelBotton}
          display={fileSelected ? "block" : "none"}
          colorScheme="green"
          onClick={handleButtonUpload}
          isLoading={isLoadingButton}
        />
      )}
    </Flex>
  );
};

const InputFile = forwardRef(InputFileBase);

export { InputFile };
