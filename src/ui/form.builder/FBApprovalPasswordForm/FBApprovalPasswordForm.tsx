import { Box } from "@material-ui/core";
import React from "react";
import { FBForm, FBTextField } from "..";
import { FBApprovalPasswordFormProps } from "./FBApprovalPasswordForm.types";
import { withFBApprovalPasswordForm } from "./FBApprovalPasswordForm.wrap";

const FBApprovalPasswordForm: React.FunctionComponent<FBApprovalPasswordFormProps> = ({
  formState,
  children,
}) => {
  // Prevent form submitting.
  const submitHandler: React.FormEventHandler = React.useCallback(
    (event) => event.preventDefault(),
    []
  );

  return (
    <FBForm {...{ formState }}>
      {/* Isolate autocomplete triggering in current form */}
      <form autoComplete="off" onSubmit={submitHandler}>
        <FBTextField
          rules="required"
          name="password"
          inputProps={{
            type: "password",
          }}
          label="form.builder.password"
        />
        <Box display="flex" justifyContent="center" mx={0}>
          {children}
        </Box>
      </form>
    </FBForm>
  );
};

export default withFBApprovalPasswordForm(FBApprovalPasswordForm);
