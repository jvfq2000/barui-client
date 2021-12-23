import { accessLevel } from "./permitions";

interface IValidateUserAccessLevelParams {
  requiredAccessLevel: string;
  userAccessLevel: string;
}

function validateUserAccessLevel({
  requiredAccessLevel,
  userAccessLevel,
}: IValidateUserAccessLevelParams): boolean {
  if (accessLevel[userAccessLevel] < accessLevel[requiredAccessLevel]) {
    return false;
  }

  return true;
}

export { validateUserAccessLevel };
