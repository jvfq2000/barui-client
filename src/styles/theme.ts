import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
  },

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
    green2: {
      "50": "#9AE6B4",
      "100": "#68D391",
      "200": "#48BB78",
      "300": "#38A169",
      "400": "#38A169",
      "500": "#48BB78",
      "600": "#68D391",
      "700": "#9AE6B4",
      "800": "#C6F6D5",
      "900": "#F0FFF4",
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
