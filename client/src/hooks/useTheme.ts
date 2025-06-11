import { extendTheme } from "@chakra-ui/react";
import "@fontsource/inter";

export const useTheme = () => {
  const theme = extendTheme({
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
  });

  return theme;
};
