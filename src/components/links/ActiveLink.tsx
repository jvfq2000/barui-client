/* eslint-disable no-nested-ternary */
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, ReactElement } from "react";

import { useColorMode } from "@chakra-ui/react";

interface IActiveLinkProps extends LinkProps {
  children: ReactElement;
  shouldMatchExactHref?: boolean;
  disableActiveLink: boolean;
}

function ActiveLink({
  children,
  shouldMatchExactHref = false,
  disableActiveLink,
  ...rest
}: IActiveLinkProps): JSX.Element {
  const { asPath } = useRouter();
  const { colorMode } = useColorMode();

  let isActive = false;

  if (
    !disableActiveLink &&
    shouldMatchExactHref &&
    (asPath === rest.href || asPath === rest.as)
  ) {
    isActive = true;
  }

  if (
    !disableActiveLink &&
    !shouldMatchExactHref &&
    (asPath.startsWith(String(rest.href)) || asPath.startsWith(String(rest.as)))
  ) {
    isActive = true;
  }

  return (
    <Link {...rest}>
      {cloneElement(children, {
        color: isActive
          ? "green.400"
          : colorMode === "dark"
          ? "grayDark.50"
          : "grayLight.50",
      })}
    </Link>
  );
}

export { ActiveLink };
