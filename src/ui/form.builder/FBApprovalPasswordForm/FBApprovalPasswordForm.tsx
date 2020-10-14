import React from "react";
import { FBTextField } from "..";
import FBForm from "../components/form/FBForm";
import { FBApprovalPasswordFormProps } from "./FBApprovalPasswordForm.types";
import { withFBApprovalPasswordForm } from "./FBApprovalPasswordForm.wrap";

const FBApprovalPasswordForm: React.FunctionComponent<FBApprovalPasswordFormProps> = ({
  formState,
}) => (

  <FBForm {...{ formState }}>
    <FBTextField
      rules="required"
      name="password"
      inputProps={{
        type: "password",
      }}
      label="form.builder.password"
    />
  </FBForm>
);

export default withFBApprovalPasswordForm(FBApprovalPasswordForm);
