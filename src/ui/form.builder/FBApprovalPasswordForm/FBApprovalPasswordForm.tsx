import { Box } from "@material-ui/core";
import React from "react";
import { FBTextField } from "..";
import FBForm from "../components/form/FBForm";
import { FBApprovalPasswordFormProps } from "./FBApprovalPasswordForm.types";
import { withFBApprovalPasswordForm } from "./FBApprovalPasswordForm.wrap";

const FBApprovalPasswordForm: React.FunctionComponent<FBApprovalPasswordFormProps> = ({
  formState,
  children,
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
    <Box display="flex" justifyContent="center">
      {children}
    </Box>
  </FBForm>
);

export default withFBApprovalPasswordForm(FBApprovalPasswordForm);
