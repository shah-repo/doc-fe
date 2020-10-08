import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBSubmitButton, FBTextField } from "..";
import FBForm from "../components/form/FBForm";
import { withFBApprovalPasswordForm } from "./FBApprovalPasswordForm.wrap";

const FBApprovalPasswordForm: React.FunctionComponent<any> = ({
  dialogState,
  formState,
  approvalTransition,
  approvalId,
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
        onClick={() => dialogState?.closeDialog()}
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
