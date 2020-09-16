import { RadioGroup as MuiRadioGroup } from "@material-ui/core";
import { RadioGroupProps as MuiRadioGroupProps } from "@material-ui/core/RadioGroup";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import { useFormContext } from "../FormContext";
import Field, { FieldOwnProps } from "./Field";

interface RadioGroupOwnProps extends FieldOwnProps {
  radioGroupProps?: MuiRadioGroupProps;
}

type RadioGroupPropsWithFormik = RadioGroupOwnProps & FormikFieldProps;

const RadioGroup: React.FunctionComponent<RadioGroupPropsWithFormik> = ({
  radioGroupProps, children, ...fieldProps
}) => {
  const { field } = fieldProps;
  const { submitForm } = useFormContext();

  return (
    <Field {...fieldProps}>
      <MuiRadioGroup
        {...fieldProps.field}
        {...radioGroupProps}
        onChange={(evt, value) => {
          field.onChange(evt);
          radioGroupProps?.onChange?.(evt, value);
          submitForm();
        }}
      >
        {children}
      </MuiRadioGroup>
    </Field>
  );
};

type RadioGroupFieldProps = RadioGroupOwnProps & FieldConfig;

const RadioGroupField: React.FunctionComponent<RadioGroupFieldProps> =
(props) => <FormikField component={RadioGroup} {...props} />;

export default RadioGroupField;
