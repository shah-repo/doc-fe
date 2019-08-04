import { Field as FormikField, FieldProps } from "formik";
import React from "react";
import AttachmentContainer from "./container";
import { EditableSelectFieldProps } from "./utils/types";

const EditableSelectField: React.FunctionComponent<EditableSelectFieldProps> = ({
  name,
  ...other
}) => {

  const childrenRenderer = (fieldProps: FieldProps) =>
    <AttachmentContainer {...other} name={name} {...fieldProps} />;

  return <FormikField name={name} render={childrenRenderer}/>;
};

export default EditableSelectField;
