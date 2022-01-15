import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Flex,
} from "@chakra-ui/react";

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
  return (
    <Flex>
      <FormControl isInvalid={!!error}>
        {!!label && (
          <FormLabel
            borderRadius="5"
            border="1px solid green"
            p="3"
            h="47px"
            bg="gray.900"
            htmlFor={name}
            id={`label-for-${name}`}
            _hover={{
              bg: "gray.800",
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
          bg="gray.900"
          variant="filled"
          _hover={{
            bg: "gray.900",
          }}
          size="lg"
          ref={ref}
          {...rest}
        />
        {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </FormControl>

      {showButtonUpload && (
        <Button
          display={fileSelected ? "block" : "none"}
          colorScheme="green"
          onClick={handleButtonUpload}
          isLoading={isLoadingButton}
        >
          {labelBotton}
        </Button>
      )}
    </Flex>
  );
};

const InputFile = forwardRef(InputFileBase);

export { InputFile };
