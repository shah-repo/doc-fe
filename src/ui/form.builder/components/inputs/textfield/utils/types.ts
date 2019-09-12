import { OutlinedTextFieldProps } from "@material-ui/core/TextField";

export interface FBTextFieldInjectedProps {
  variant: "outlined";
}

export interface FBTextFieldProps extends OutlinedTextFieldProps, FBTextFieldInjectedProps {

}
