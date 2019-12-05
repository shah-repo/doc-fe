import { FormControlLabelProps } from "@material-ui/core/FormControlLabel/FormControlLabel";
import { FBInputProps } from "../common";
import { FBCheckContextProps } from "../common/checkcontext";

export type FBCheckboxProps =
  & FBInputProps
  & FBCheckContextProps
  & {
    control?: FormControlLabelProps["control"];
    isGroup?: boolean;
  };
