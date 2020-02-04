import { FBInputProps, FBOptionProps } from "../common";
import { FBContextProps } from "../common/context";

export type FBSelectProps =
  & Pick<FBContextProps, "includeContext">
  & FBOptionProps
  & FBInputProps
  & {
    menuItems?: React.ReactNode[];
  };
