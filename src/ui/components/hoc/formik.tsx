import { Field as FormikField, FieldProps } from "formik";
import React from "react";
import { FormikHybridFieldProps } from "./utils/types";

export function withFormik<T extends FormikHybridFieldProps>(Component: React.ComponentType<T>) {

  return (props: T) => {
    const childrenRenderer = (fieldProps: FieldProps) =>
      <Component {...props} {...fieldProps} />;

    return <FormikField name={props.name} render={childrenRenderer}/>;
  };
}
