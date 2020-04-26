import { FBInputProps, FBOptionProps } from "..";

export type FBSelectProps =
& FBInputProps
& FBOptionProps
& {
  menuItems?: React.ReactNode[];
};
