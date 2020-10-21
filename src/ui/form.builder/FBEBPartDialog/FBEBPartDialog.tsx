import { Box } from "@material-ui/core";
import React from "react";
import { FBTextField } from "..";
import FBForm from "../components/form/FBForm";
import { FBEBPartDialogProps } from "./FBEBPartDialog.types";
import { withFBEBPartDialog } from "./FBEBPartDialog.wrap";

const FBEBPartDialog: React.FunctionComponent<FBEBPartDialogProps> = ({
  formState,
  name,
  children,
}) => (
  <FBForm {...{ formState }}>
    <FBTextField
      rules="required"
      name={`fb-ebpart-title-${name}`}
      label="form.builder.title"
    />
    <Box display="flex" justifyContent="center" mx={0}>
      {children}
    </Box>
  </FBForm>
);

export default withFBEBPartDialog(FBEBPartDialog);
