import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBSubmitButton, FBTextField } from "..";
import FBForm from "../components/form/FBForm";
import { FBApprovalPasswordFormProps } from "./FBApprovalPasswordForm.types";
import { withFBApprovalPasswordForm } from "./FBApprovalPasswordForm.wrap";

const FBApprovalPasswordForm: React.FunctionComponent<FBApprovalPasswordFormProps> = ({
  formState,
  onDialogClose,
  onDialogApprove,
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
    <Box display="flex" justifyContent="center" mx={3}>
      <FBButton
        variant="outlined"
        onClick={onDialogClose}
        label="common.cancel"
      >
      </FBButton>
      <FBSubmitButton
        variant="contained"
        label="common.confirm"
        onClick={onDialogApprove}
      />
    </Box>
  </FBForm>
);

export default withFBApprovalPasswordForm(FBApprovalPasswordForm);
