import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
} from "@material-ui/core";
import { CheckboxProps as MuiCheckboxProps } from "@material-ui/core/Checkbox";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Field, { FieldOwnProps } from "./Field";
import Text from "../../Text";
import { Translation } from "../../../translations/types";

interface CheckboxOwnProps extends FieldOwnProps {
  checkboxProps?: MuiCheckboxProps;
}

interface OwnProps {
  label: Translation;
}

type CheckboxPropsWithFormik = CheckboxOwnProps & FormikFieldProps & OwnProps;

const Checkbox: React.FunctionComponent<CheckboxPropsWithFormik> = ({ checkboxProps, label, ...fieldProps }) => {
  const { field } = fieldProps;

  return (
    <Field {...fieldProps}>
      <FormControlLabel
        control={
          <MuiCheckbox
            {...fieldProps.field}
            {...checkboxProps}
            checked={field.value && true}
            value={field.value ? 'checked' : ''}
          />
        }
        label={<Text translation={label} />}
      />
    </Field>
  );
};

type CheckboxFieldProps = CheckboxOwnProps & FieldConfig;

const CheckboxField: React.FunctionComponent<CheckboxFieldProps> = (props) => <FormikField component={Checkbox} {...props} />;

export default CheckboxField;
