import { InputBaseProps } from "@material-ui/core";

export type PasswordFieldProps = Omit<InputBaseProps, "type"> & {
  singleMode?: boolean;
};
