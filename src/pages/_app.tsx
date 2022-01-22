import { AppProps } from "next/app";
import { RiMoonLine, RiSunLine } from "react-icons/ri";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { ChakraProvider, Icon, IconButton } from "@chakra-ui/react";

import { AuthProvider } from "../contexts/AuthContext";
import { SidebarDrawerProvider } from "../contexts/SidebarDrawerContext";
import { queryClient } from "../services/queryClient";
import { theme } from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <SidebarDrawerProvider>
            <Component {...pageProps} />
          </SidebarDrawerProvider>
        </ChakraProvider>

        <ReactQueryDevtools />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
