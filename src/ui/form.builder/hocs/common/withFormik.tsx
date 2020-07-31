import { Field as FormikField, FieldProps } from "formik";
import React from "react";
import { FBInputProps } from "../../types/common";

export const withFormik = <T extends FBInputProps, U>(
  Component: React.FunctionComponent<T>,
) => (props: T) => {
  const render = (fieldProps: FieldProps<U>) =>
    <Component {...fieldProps} {...props} />;

  return (
    <FormikField name={props.name} validate={props.validate}>
      {render}
    </FormikField>);
};
