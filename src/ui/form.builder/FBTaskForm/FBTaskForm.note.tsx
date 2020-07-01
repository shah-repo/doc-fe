import React from "react";
import { FBForm, FBTaskFormProps } from "..";
import { FBFileUpload } from "../FBFileUpload";
import { FBSchema } from "../FBSchema";
import { withFBTaskForm } from "./FBTaskForm.wrap";

const FBTaskFormNote: React.FunctionComponent<FBTaskFormProps> = ({
  formState,
  children,
  schema,
}) => (
  <FBForm {...{ formState }} >
    <FBSchema {...{ schema }} />
    <FBFileUpload name="closingNoteInput.attachments" />
    {children}
  </FBForm>
);

export default withFBTaskForm(FBTaskFormNote);
