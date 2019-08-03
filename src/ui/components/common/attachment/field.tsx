import { Field, FieldProps } from "formik";
import React from "react";
import AttachmentContainer from "./container";
import { AttachmentFieldProps } from "./utils/types";

type Props = AttachmentFieldProps;

const AttachmentField: React.FunctionComponent<Props> = ({
  component,
  name,
  multiple = true,
}) => {

  const childrenRenderer = (fieldProps: FieldProps) =>
    <AttachmentContainer component={component} name={name} multiple={multiple} {...fieldProps} />;

  return <Field name={name} render={childrenRenderer}/>;
};

export default AttachmentField;
