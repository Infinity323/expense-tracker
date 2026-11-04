import { Icon } from "@chakra-ui/react";
import type { IconProps } from "@chakra-ui/react";
import type { ElementType } from "react";
import type { IconType } from "react-icons";

interface ReactIconProps extends Omit<IconProps, "as"> {
  icon: IconType;
}

export function ReactIcon({ icon, ...props }: ReactIconProps) {
  // CRA's TypeScript 4 types reject react-icons' ReactNode return type here.
  return <Icon as={icon as unknown as ElementType} {...props} />;
}
