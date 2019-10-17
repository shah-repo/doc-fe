import { FormControlLabelProps } from "@material-ui/core/FormControlLabel/FormControlLabel";
import { FBFormDefaultProps, FBOnChangeProps } from "./common";

export type FBCheckboxProps =
  & FBFormDefaultProps
  & Partial<Omit<FormControlLabelProps, "label">>
  & FBOnChangeProps;
