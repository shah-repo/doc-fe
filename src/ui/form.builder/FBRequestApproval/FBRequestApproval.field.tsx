import React from "react";
import { FBApproval, FBButton, FBFieldName, FBLabel, FBRequestApprovalProps } from "..";
import { withFBRequestApproval } from "./FBRequestApproval.wrap";

const FBRequestApprovalField: React.FunctionComponent<FBRequestApprovalProps> = ({
  handleAddEdit,
  defaultValue: { approvers, approverGroups, approveIsBlocking } = {},
  label,
  disabled,
  isOutput,
  name,
}) => (
  <>
    {(!isOutput || (!approvers && !approverGroups)) && (
      <FBLabel label={label || "form.builder.requestapproval"} />
    )}
    {isOutput && (
      <FBApproval
        {...{ approvers, approverGroups, approveIsBlocking }}
        label="form.builder.requestapproval"
        name={`${FBFieldName.RequestApproval}${name}`}
      />
    )}
    <FBButton
      fullWidth={true}
      label="form.builder.add.approvers"
      variant="outlined"
      style={{ margin: 0 }}
      onClick={handleAddEdit}
      {...{ disabled }}
    />
  </>
);


export default withFBRequestApproval(FBRequestApprovalField);
