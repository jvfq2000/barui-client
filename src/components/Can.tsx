import { ReactNode } from "react";

import { useCan } from "../services/hooks/useCan";

interface ICanProps {
  children: ReactNode;
  accessLevel: string;
}

function Can({ children, accessLevel }: ICanProps): JSX.Element {
  const userCanSeeComponent = useCan(accessLevel);

  if (!userCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
}

export { Can };
