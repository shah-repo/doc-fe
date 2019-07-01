import {
  RadioGroup as MuiRadioGroup,
} from "@material-ui/core";
import { RadioGroupProps as MuiRadioGroupProps } from "@material-ui/core/RadioGroup";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Field, { FieldOwnProps } from "./Field";
import ErrorMessage from "./ErrorMessage";

interface RadioGroupOwnProps extends FieldOwnProps {
  radioGroupProps?: MuiRadioGroupProps;
}

type RadioGroupPropsWithFormik = RadioGroupOwnProps & FormikFieldProps;

const RadioGroup: React.FunctionComponent<RadioGroupPropsWithFormik> = ({ radioGroupProps, children, ...fieldProps }) => {
  return (
    <Field {...fieldProps}>
      <ErrorMessage {...fieldProps} />
      <MuiRadioGroup {...fieldProps.field} {...radioGroupProps}>
        {children}
      </MuiRadioGroup>
    </Field>
  );
};

type RadioGroupFieldProps = RadioGroupOwnProps & FieldConfig;

const RadioGroupField: React.FunctionComponent<RadioGroupFieldProps> = (props) => <FormikField component={RadioGroup} {...props} />;

export default RadioGroupField;
