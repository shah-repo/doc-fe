import { FormHelperText } from "@material-ui/core";
import React from "react";
import { SMErrorLabelProps, SMText } from "../../..";
import { withSMErrorLabel } from "./SMErrorLabel.wrap";

const SMErrorLabel: React.FunctionComponent<SMErrorLabelProps> = ({
  error,
}) => (
  <>
    {error && (
      <FormHelperText error={true}>
        <SMText label={error} />
      </FormHelperText>
    )}
  </>
);

export default withSMErrorLabel(SMErrorLabel);
