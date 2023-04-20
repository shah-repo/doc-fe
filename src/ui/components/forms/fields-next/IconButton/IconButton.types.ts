import { BasicButtonKinds, ButtonProps } from "../Button/Button.types";

export type IconButtonProps = Omit<ButtonProps, "kind" | "size"> & {
  kind?: BasicButtonKinds | "simple" | "destructive" | "form" | "action";
  size?: number;
};
