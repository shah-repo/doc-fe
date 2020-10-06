import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBSubmitButton, FBTextField } from "..";
import FBForm from "../components/form/FBForm";
import { withFBInlinePasswordForm } from "./FBInlinePasswordForm.wrap";

const FBInlinePasswordForm: React.FunctionComponent<any> = ({
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
    <Box display="flex" mx={3}>
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

export default withFBInlinePasswordForm(FBInlinePasswordForm);
