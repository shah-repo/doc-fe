// import { FormControlLabelProps } from "@material-ui/core/FormControlLabel/FormControlLabel";
import { FormGroupProps } from "@material-ui/core/FormGroup";
import { FBInputProps, FBOptionProps } from "../common";
import { FBContextProps } from "../common/context";

export type FBCheckGroupProps =
  & FBOptionProps
  & FBInputProps
  & FBContextProps
  & Pick<FormGroupProps, "row">;
