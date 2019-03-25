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
}

type FieldProps = FieldOwnProps & FormikFieldProps;

const Field: React.FunctionComponent<FieldProps> = ({
  field,
  form: { touched, errors },
  children,
  formControlProps,
  label,
}) => {
  const error = _.get(errors, field.name);
  const isFieldTouched = _.get(touched, field.name);
  const shouldDisplayError = Boolean(isFieldTouched && error);

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
    <FormControl margin="normal" required={true} fullWidth={true} error={shouldDisplayError} {...formControlProps}>
      {LabelComponent}
      {children}
      {ErrorComponent}
    </FormControl>
  );
};

export default Field;
