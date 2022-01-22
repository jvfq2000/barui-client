import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  colors: {
    whiteAlpha: {
      "900": "#181B23",
      "800": "#1F2029",
      "700": "#353646",
      "600": "#4B4D63",
      "500": "#616480",
      "400": "#797D9A",
      "300": "#9699B0",
      "200": "#B3B5C6",
      "100": "#D1D2DC",
      "50": "#EEEEF2",
    },
    grayDark: {
      "900": "#181B23",
      "800": "#1F2029",
      "700": "#353646",
      "600": "#4B4D63",
      "500": "#616480",
      "400": "#797D9A",
      "300": "#9699B0",
      "200": "#B3B5C6",
      "100": "#D1D2DC",
      "50": "#EEEEF2",
    },
    grayLight: {
      "50": "#181B23",
      "100": "#1F2029",
      "200": "#353646",
      "300": "#4B4D63",
      "400": "#616480",
      "500": "#797D9A",
      "600": "#9699B0",
      "700": "#B3B5C6",
      "800": "#D1D2DC",
      "900": "#EEEEF2",
    },
  },

  fonts: {
    heading: "Roboto",
    body: "Roboto",
  },

  styles: {
    global: props => ({
      body: {
        bg: mode("grayLight.900", "grayDark.900")(props),
        color: mode("grayLight.50", "grayDark.50")(props),
      },
    }),
  },
});

export { theme };
