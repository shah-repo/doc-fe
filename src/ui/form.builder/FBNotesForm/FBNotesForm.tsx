import React from "react";
import { FBButton, FBForm, FBNotesFormProps, FBTextField } from "..";
import { withFBNotesForm } from "./FBNotesForm.wrap";

const FBNotesForm: React.FunctionComponent<FBNotesFormProps> = ({
  handleNote,
  formState,
  ...props
}) => (
  <FBForm {...{ formState }}>
    <FBTextField label="test" name="test" />
    <FBButton label="Add note" onClick={handleNote} />
  </FBForm>
);

export default withFBNotesForm(FBNotesForm);
