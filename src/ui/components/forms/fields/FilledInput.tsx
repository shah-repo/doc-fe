import {
  FilledInput as MuiInput,
} from "@material-ui/core";
import { InputProps as MuiInputProps } from "@material-ui/core/Input";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Field, { FieldOwnProps } from "./Field";

interface InputOwnProps extends FieldOwnProps {
  inputProps?: MuiInputProps;
}

type InputPropsWithFormik = InputOwnProps & FormikFieldProps;

const Input: React.FunctionComponent<InputPropsWithFormik> = ({ inputProps, ...fieldProps }) => (
  <Field variant="filled" required={fieldProps.required} {...fieldProps}>
    <MuiInput required={false} {...fieldProps.field} {...inputProps} />
  </Field>
);

type InputFieldProps = InputOwnProps & FieldConfig;

const FilledInputField: React.FunctionComponent<InputFieldProps> = (props) =>
  <FormikField component={Input} {...props} />;

export default FilledInputField;
