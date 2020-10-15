import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBSubmitButton, FBTextField } from "..";
import FBForm from "../components/form/FBForm";
import { FBApprovalPasswordFormProps } from "./FBApprovalPasswordForm.types";
import { withFBApprovalPasswordForm } from "./FBApprovalPasswordForm.wrap";

const FBApprovalPasswordForm: React.FunctionComponent<FBApprovalPasswordFormProps> = ({
  dialogState,
  formState,
  approvalTransition,
  approvalId,
  onDialogClose,
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
        onClick={() => {
          approvalTransition?.("approve", approvalId);
          dialogState?.closeDialog();
        }}
      />
    </Box>
  </FBForm>
);

export default withFBApprovalPasswordForm(FBApprovalPasswordForm);
