import { FBInputProps } from "../common";
import { FormControlLabelProps } from "@material-ui/core/FormControlLabel/FormControlLabel";

export type FBCheckboxProps =
  & FBInputProps
  & Pick<FormControlLabelProps, "control">
  & {
    isGroup?: boolean;
    includeNote?: boolean;
    showNote?: boolean;
  };