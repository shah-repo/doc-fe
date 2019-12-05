import { FBInputProps, FBOptionProps } from "../common";
import { FBCheckContextProps } from "../common/checkcontext";

export type FBSelectProps =
  & Pick<FBCheckContextProps, "includeContext">
  & FBOptionProps
  & FBInputProps
  & {
    menuItems?: React.ReactNode[];
  };
