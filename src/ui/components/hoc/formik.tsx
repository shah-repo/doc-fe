import { Field as FormikField, FieldProps } from "formik";
import React from "react";
import { FormikHybridFieldProps } from "./utils/types";

export function withFormik<T extends FormikHybridFieldProps, U>(Component: React.ComponentType<T>) {

  return (props: T) => {
    const childrenRenderer = (fieldProps: FieldProps<U>) =>
      <Component {...fieldProps} {...props} />;

    return <FormikField name={props.name} render={childrenRenderer}/>;
  };
}
