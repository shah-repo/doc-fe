import React from "react";
import { FBFileUpload, FBForm, FBSchema, FBTaskFormProps, FBTextField } from "..";
import { withFBTaskForm } from "./FBTaskForm.wrap";

const FBTaskFormNote: React.FunctionComponent<FBTaskFormProps> = ({
  formState,
  children,
  schema,
}) => (
  <FBForm {...{ formState }} >
    <FBTextField name="id" hidden={true} />
    <FBSchema {...{ schema }} />
    <FBFileUpload name="attachments" />
    {children}
  </FBForm>
);

export default withFBTaskForm(FBTaskFormNote);
