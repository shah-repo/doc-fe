import {
  Checkbox as MuiCheckbox,
} from "@material-ui/core";
import { CheckboxProps as MuiCheckboxProps } from "@material-ui/core/Checkbox";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Field, { FieldOwnProps } from "./Field";

interface CheckboxOwnProps extends FieldOwnProps {
  checkboxProps?: MuiCheckboxProps;
}

type CheckboxPropsWithFormik = CheckboxOwnProps & FormikFieldProps;

const Checkbox: React.FunctionComponent<CheckboxPropsWithFormik> = ({ checkboxProps, ...fieldProps }) => {
  const { field } = fieldProps;

  return (
    <Field {...fieldProps}>
      <MuiCheckbox
        {...fieldProps.field}
        {...checkboxProps}
        checked={field.value ? 'checked' : ''}
        value={field.value ? 'checked' : ''}
      />
    </Field>
  );
};

type CheckboxFieldProps = CheckboxOwnProps & FieldConfig;

const CheckboxField: React.FunctionComponent<CheckboxFieldProps> = (props) => <FormikField component={Checkbox} {...props} />;

export default CheckboxField;
