import { InputBaseProps as MuiInputProps } from "@material-ui/core/InputBase";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import { RenderSize } from "../../../../state/ducks/common";
import Field, { FieldOwnProps } from "./Field";
import { InputField as MuiInput } from "./Input.styles";

interface InputOwnProps extends FieldOwnProps {
  inputProps?: MuiInputProps;
  size?: RenderSize;
  actionsRenderer?: () => any;
  lpignore?: boolean;
}

type InputPropsWithFormik = InputOwnProps & FormikFieldProps;

const Input: React.FunctionComponent<InputPropsWithFormik> = ({
  inputProps,
  size = "md",
  actionsRenderer,
  lpignore = true,
  ...fieldProps
}) => (
    <Field size={size} actionsRenderer={actionsRenderer} {...fieldProps} inputLabelProps={{ shrink: true }} >
      <MuiInput
        required={false}
        inputProps={{ "data-lpignore": lpignore }}
        {...fieldProps.field}
        {...inputProps}
      />
    </Field>
  );

type InputFieldProps = InputOwnProps & FieldConfig;

const InputField: React.FunctionComponent<InputFieldProps> = (props) => <FormikField component={Input} {...props} />;

export default InputField;
