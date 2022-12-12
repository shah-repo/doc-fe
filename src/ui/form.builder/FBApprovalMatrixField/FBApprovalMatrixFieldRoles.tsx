import React from "react";
import { FBApprovalMatrixFieldProps, FBApprovalMatrixRoles, FBInput, FBProvider } from "..";
import { withFBApprovalMatrixField } from "./FBApprovalMatrixField.wrap";

const FBApprovalMatrixFieldRoles: React.FunctionComponent<FBApprovalMatrixFieldProps> = ({
  handleAdd,
  approvalMatrixFieldState,
  disabled,
  autosave,
  name = "dar-built-in",
  mode,
  workspaceMode,
}) =>  (
  <FBProvider {...{ approvalMatrixFieldState }}>
    <FBInput {...{ name, disabled, autosave }} type="approvalRoles">
      <FBApprovalMatrixRoles {...{ disabled, name }} />
    </FBInput>
  </FBProvider>
);

export default withFBApprovalMatrixField(FBApprovalMatrixFieldRoles);
