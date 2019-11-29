import { Field as FormikField, FieldProps } from "formik";
import React from "react";
import { FBFormikFieldProps } from "../../types/formik";

export const withFormik = <T extends FBFormikFieldProps, U>(
  Component: React.FunctionComponent<T>,
) => {
  return (props: T) => {

    const render = (fieldProps: FieldProps<U>) =>
      <Component {...fieldProps} {...props as T} />;

    return <FormikField name={props.name}>{render}</FormikField>;
  };
};
