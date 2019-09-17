import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { FormikHybridFieldProps } from "../../../../../components/hoc/utils/types";

export interface FBTextFieldInjectedProps  {
  variant: "outlined";
  labelRenderer?: JSX.Element;
  onTextFieldChange: () => (event: React.ChangeEvent<HTMLInputElement>) => any;
}

export type FBTextFieldProps = OutlinedTextFieldProps & FBTextFieldInjectedProps & FormikHybridFieldProps;
