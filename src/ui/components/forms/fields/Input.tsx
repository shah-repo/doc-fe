import {
  FormControl,
  FormHelperText,
  Input as MuiInput,
  InputLabel,
} from "@material-ui/core";
import { FormControlProps } from "@material-ui/core/FormControl";
import { InputProps as MuiInputProps } from "@material-ui/core/Input";
import { Field as FormikField, FieldConfig, FieldProps } from "formik";
import * as React from "react";
import { Translation } from "../../../translations/types";
import Message from "../../Message";

interface InputBaseProps {
  label?: Translation;
  inputProps?: MuiInputProps;
  formControlProps?: FormControlProps;
}

interface InputProps extends InputBaseProps, FieldProps {}

const Input: React.FunctionComponent<InputProps> = ({
  field,
  form: { touched, errors },
  inputProps,
  formControlProps,
  label,
}) => {
  const error = errors[field.name];
  const shouldDisplayError = Boolean(touched[field.name] && error);

  const LabelComponent = label && (
    <InputLabel htmlFor={field.name}>
      <Message id={label} />
    </InputLabel>
  );

  const ErrorComponent = shouldDisplayError && (
    <FormHelperText>
      <Message id={String(error)} />
    </FormHelperText>
  );

  return (
    <FormControl margin="normal" required={true} fullWidth={true} error={shouldDisplayError} {...formControlProps}>
      {LabelComponent}
      <MuiInput {...field} {...inputProps} />
      {ErrorComponent}
    </FormControl>
  );
};

interface InputFieldProps extends InputBaseProps, FieldConfig {}

const InputField: React.FunctionComponent<InputFieldProps> = (props) => {
  return <FormikField component={Input} {...props} />;
};

export default InputField;
