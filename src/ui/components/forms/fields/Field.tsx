import {
  FormControl,
  FormHelperText,
  InputLabel,
} from "@material-ui/core";
import { FormControlProps } from "@material-ui/core/FormControl";
import { FieldProps as FormikFieldProps } from "formik";
import _ from "lodash";
import * as React from "react";
import { Translation } from "../../../translations/types";
import Text from "../../Text";

export interface FieldOwnProps {
  label?: Translation;
  formControlProps?: FormControlProps;
  variant?: "standard" | "outlined" | "filled";
  required?: boolean;
}

type FieldProps = FieldOwnProps & FormikFieldProps;

const Field: React.FunctionComponent<FieldProps> = ({
  field,
  form,
  form: { touched, errors, isSubmitting },
  children,
  formControlProps,
  label,
  variant,
  required,
}) => {
  const error = _.get(errors, field.name);
  const isFieldTouched = _.get(touched, field.name);
  const shouldDisplayError = Boolean(isFieldTouched && error);

  // Workaround for untouched select fields
  if (error && !shouldDisplayError && isSubmitting) {
    form!.setFieldTouched(field.name, true);
  }

  const LabelComponent = label && (
    <InputLabel htmlFor={field.name}>
      <Text translation={label} />
    </InputLabel>
  );

  const ErrorComponent = shouldDisplayError && (
    <FormHelperText>
      <Text message={String(error)} />
    </FormHelperText>
  );

  return (
    <FormControl
      variant={variant || "standard"}
      margin="normal"
      required={required}
      fullWidth={true}
      error={shouldDisplayError}
      {...formControlProps}
    >
      {LabelComponent}
      {children}
      {ErrorComponent}
    </FormControl>
  );
};

export default Field;
