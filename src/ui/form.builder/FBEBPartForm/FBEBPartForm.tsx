import { Box } from "@material-ui/core";
import React from "react";
import { FBEBPartFormProps, FBTextField } from "..";
import FBForm from "../components/form/FBForm";
import { withFBEBPartForm } from "./FBEBPartForm.wrap";

const FBEBPartForm: React.FunctionComponent<FBEBPartFormProps> = ({
  formState,
  children,
}) => (
  <FBForm {...{ formState }}>
    <FBTextField
      rules="required"
      name="name"
      label="form.builder.title"
    />
    <Box display="flex" justifyContent="center" mx={0}>
      {children}
    </Box>
  </FBForm>
);

export default withFBEBPartForm(FBEBPartForm);
