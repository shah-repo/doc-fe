import { FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import Text from "../../Text";

// tslint:disable-next-line: no-empty-interface
interface ErrorMessageOwnProps extends FormikFieldProps {}

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
