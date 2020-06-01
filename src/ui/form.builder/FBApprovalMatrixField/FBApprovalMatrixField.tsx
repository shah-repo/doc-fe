import React from "react";
import { FBApprovalMatrix, FBApprovalMatrixFieldProps, FBApprovalMatrixRoles, FBProvider } from "..";
import { withFBApprovalMatrixField } from "./FBApprovalMatrixField.wrap";

const FBApprovalMatrixField: React.FunctionComponent<FBApprovalMatrixFieldProps> = ({
  handleAdd,
  approvalMatrixFieldState,
  disabled,
  name,
  mode,
  workspaceMode,
}) =>  (
  <FBProvider {...{ approvalMatrixFieldState }}>
    <FBApprovalMatrixRoles {...{ disabled, name }} />
    <FBApprovalMatrix {...{ disabled, handleAdd, name, mode, workspaceMode }} />
  </FBProvider>
);

export default withFBApprovalMatrixField(FBApprovalMatrixField);
