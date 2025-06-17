import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import "@fontsource/inter";

export const useTheme = () => {
  const config: ThemeConfig = {
    initialColorMode: "system",
    useSystemColorMode: false,
  };

  const theme = extendTheme({
    ...config,
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
  });

  return theme;
};
