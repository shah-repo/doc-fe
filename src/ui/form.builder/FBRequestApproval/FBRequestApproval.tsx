import React from "react";
import { FBInput, FBInputProps, FBRequestApprovalField } from "..";

const FBRequestApproval: React.FunctionComponent<FBInputProps> = ({
  label,
  ...props
}) => (
  <FBInput {...props} >
    <FBRequestApprovalField {...props} {...{ label }} />
  </FBInput>
);


export default FBRequestApproval;
