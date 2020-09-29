import { SelectProps } from "@material-ui/core";
import { FBInputProps, FBOptionProps } from "..";

export type FBSelectProps =
& Pick<SelectProps, "style" | "variant" | "SelectDisplayProps" | "onOpen" | "onFocus">
& FBInputProps
& FBOptionProps
& {
  menuItems?: React.ReactNode[];
};
