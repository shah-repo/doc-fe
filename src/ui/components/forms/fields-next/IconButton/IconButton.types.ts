import { BasicButtonKinds, ButtonProps } from "../Button/Button.types";

export type IconButtonProps = Omit<ButtonProps, "kind" | "size"> & {
  kind?: BasicButtonKinds | "square" | "destructive" | "boxed" | "simple";
  size?: number;
};
