import { FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Text from "../../Text";

// eslint-disable-next-line: no-empty-interface
type ErrorMessageOwnProps = FormikFieldProps;

type ErrorMessageProps = ErrorMessageOwnProps;

const ErrorMessage: React.FunctionComponent<ErrorMessageProps> = ({
  field,
  form,
}) => {
  const errorMessage: any = form.errors[field.name];

  if (!errorMessage) {
    return null;
  }

  return (
    <span style={{ color: "red" }}>
      <Text message={errorMessage} />
    </span>
  );
};

export default ErrorMessage;
