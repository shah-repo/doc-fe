import { Field as FormikField, FieldProps } from "formik";
import React from "react";
import Container from "./container";
import { AttachmentIconProps } from "./utils/types";

const AttachmentIconField: React.FunctionComponent<AttachmentIconProps> = (props: AttachmentIconProps) => {

  const childrenRenderer = (fieldProps: FieldProps) =>
    <Container {...props} {...fieldProps} />;

  return <FormikField name={props.name} render={childrenRenderer}/>;
};

export default AttachmentIconField;
