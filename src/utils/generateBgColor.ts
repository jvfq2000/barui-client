export function defaultBgColor(
  listInTable: boolean,
  isWideVersion: boolean,
  colorMode: string,
): string {
  if (listInTable && isWideVersion) {
    return colorMode === "dark" ? "grayDark.800" : "grayLight.800";
  }
  return "";
}
