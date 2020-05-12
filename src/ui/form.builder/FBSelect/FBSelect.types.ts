import { SelectProps } from "@material-ui/core";
import { FBInputProps, FBOptionProps } from "..";

export type FBSelectProps =
& FBInputProps
& FBOptionProps
& Pick<SelectProps, "SelectDisplayProps">
& {
  menuItems?: React.ReactNode[];
};
