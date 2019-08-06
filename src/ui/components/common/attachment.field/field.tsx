import { Field as FormikField, FieldProps } from "formik";
import React from "react";
import AttachmentContainer from "./container";
import { AttachmentFieldProps } from "./utils/types";

const AttachmentField: React.FunctionComponent<AttachmentFieldProps> = ({
  name,
  ...other
}) => {

  const childrenRenderer = (fieldProps: FieldProps) =>
    <AttachmentContainer {...other} name={name} {...fieldProps} />;

  return <FormikField name={name} render={childrenRenderer}/>;
};

export default AttachmentField;
