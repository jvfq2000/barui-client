import { forwardRef, ForwardRefRenderFunction } from "react";

import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";

interface IButtonProps extends ChakraButtonProps {
  label: string;
  colorScheme?: string;
}

const ButtonBase: ForwardRefRenderFunction<HTMLButtonElement, IButtonProps> = ({
  label,
  colorScheme,
  ...rest
}): JSX.Element => {
  return (
    <ChakraButton
      color="white"
      bg={`${colorScheme}.600`}
      _hover={{
        bg: `${colorScheme}.700`,
      }}
      {...rest}
    >
      {label}
    </ChakraButton>
  );
};

const Button = forwardRef(ButtonBase);

export { Button };
