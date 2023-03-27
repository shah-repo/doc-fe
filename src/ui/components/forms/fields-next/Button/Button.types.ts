import { ButtonProps as MuiButtonProps } from "@material-ui/core";

export type BasicButtonKinds = "primary" | "secondary" | "ghost" | "outlined" | "white";

export type ButtonProps = MuiButtonProps & {
  kind?: BasicButtonKinds  | "add";
};

export type ButtonVariantProps = [
  MuiButtonProps["variant"],
  MuiButtonProps["color"]
];

export type ButtonKindToVariantMap<T extends string> = Partial<Record<T, ButtonVariantProps>>;
