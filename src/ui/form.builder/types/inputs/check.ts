import { FormControlLabelProps } from "@material-ui/core/FormControlLabel/FormControlLabel";
import { FormGroupProps } from "@material-ui/core/FormGroup";
import { FBInputProps, FBOptionProps } from "../common";
import { FBCheckContextProps } from "../common/checkcontext";

export type FBCheckType = "checkbox" | "radio";
// export type FBCheckGroupType = "checkboxgroup" | "radiogroup";

export type FBCheckProps =
  & FBInputProps
  & FBCheckContextProps
  & {
    control?: FormControlLabelProps["control"];
    isGroup?: boolean;
  };

export type FBCheckGroupProps =
  & FBOptionProps
  & FBInputProps
  & FBCheckContextProps
  & Pick<FormGroupProps, "row">
  & {
    controls?: Array<FormControlLabelProps["control"]>;
  };
