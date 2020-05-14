import { Checkbox as MuiCheckbox, FormControlLabel } from "@material-ui/core";
import { CheckboxProps as MuiCheckboxProps } from "@material-ui/core/Checkbox";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import { Translation } from "../../../translations/types";
import Text from "../../Text";
import { useFormContext } from "../FormContext";
import Field, { FieldOwnProps } from "./Field";

interface CheckboxOwnProps extends FieldOwnProps {
  checkboxProps?: MuiCheckboxProps;
}

interface OwnProps {
  label: Translation;
}

type CheckboxPropsWithFormik = CheckboxOwnProps & FormikFieldProps & OwnProps;

const Checkbox: React.FunctionComponent<CheckboxPropsWithFormik> = ({ checkboxProps, label, ...fieldProps }) => {
  const { field, form } = fieldProps;
  const { disableFieldSubmit } = useFormContext();

  return (
    <Field {...fieldProps} >
      <FormControlLabel id="Checkbox-label"
        control={
          <MuiCheckbox
            {...fieldProps.field}
            {...checkboxProps}
            checked={checkboxProps?.disabled ? false : field.value && true}
            value={field.value ? "checked" : ""}
            id="Checkbox-box"
            onChange={(evt, checked: boolean) => {
              field.onChange(evt);
              checkboxProps?.onChange?.(evt, checked);
              if (!disableFieldSubmit) {
                form.submitForm();
              }
            }}
          />
        }
        label={<Text translation={label} />}
      />
    </Field>
  );
};

type CheckboxFieldProps = CheckboxOwnProps & FieldConfig;

const CheckboxField: React.FunctionComponent<CheckboxFieldProps> = (props) =>
  <FormikField component={Checkbox} {...props} />;

export default CheckboxField;
