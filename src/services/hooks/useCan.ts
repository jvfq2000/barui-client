import { useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import { validateUserAccessLevel } from "../../utils/validadeUserAccessLevel";

function useCan(requiredAccessLevel: string): boolean {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

  return validateUserAccessLevel({
    userAccessLevel: user.accessLevel,
    requiredAccessLevel,
  });
}

export { useCan };
