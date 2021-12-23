import { ElementType } from "react";

import {
  Link as ChakraLink,
  Text,
  Icon,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";

interface ILinkProps extends ChakraLinkProps {
  icon: ElementType;
  href: string;
  children: string;
  iconPositionRight?: boolean;
}

function Link({
  icon,
  children,
  href,
  iconPositionRight = false,
  ...rest
}: ILinkProps): JSX.Element {
  return (
    <ChakraLink display="flex" align="center" {...rest}>
      {!iconPositionRight && <Icon as={icon} mr="4" fontSize="20"></Icon>}
      <Text fontWeight="medium">{children}</Text>
      {iconPositionRight && <Icon as={icon} ml="4" fontSize="20"></Icon>}
    </ChakraLink>
  );
}

export { Link };
