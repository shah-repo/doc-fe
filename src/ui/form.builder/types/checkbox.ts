import { FormControlLabelProps } from "@material-ui/core/FormControlLabel/FormControlLabel";
import { FormikHybridFieldProps } from "../../components/hoc/utils/types";
import {
  FBFormDefaultProps,
  FBLabelRendererProps,
  FBOnChangeProps,
} from "./common";

export interface FBCheckboxInjectedProps extends FBLabelRendererProps  {
  control: React.ReactElement[];
}

export interface FBCheckboxOption {
  name?: string;
  controlLabel: string;
}

export type FBCheckboxGroupProps =
  FBFormDefaultProps &
  Omit<FBCheckboxInjectedProps, "control"> & {
  options: FBCheckboxOption[];
};

export type FBCheckboxProps =
  FBFormDefaultProps &
  Partial<Omit<FormControlLabelProps, "label">> &
  FBCheckboxInjectedProps &
  FBOnChangeProps &
  FormikHybridFieldProps & {
  controlLabel?: string;
};
