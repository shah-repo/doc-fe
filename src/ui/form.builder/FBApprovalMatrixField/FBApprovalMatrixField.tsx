import React from "react";
import { FBApprovalMatrix, FBApprovalMatrixFieldProps, FBApprovalMatrixRoles, FBInput, FBProvider } from "..";
import { withFBApprovalMatrixField } from "./FBApprovalMatrixField.wrap";

const FBApprovalMatrixField: React.FunctionComponent<FBApprovalMatrixFieldProps> = ({
  handleAdd,
  approvalMatrixFieldState,
  disabled,
  autosave,
  name,
  mode,
  workspaceMode,
}) =>  (
  <FBProvider {...{ approvalMatrixFieldState }}>
    <FBInput {...{ name, disabled, autosave }} type="approvalMatrix">
      <>
        <FBApprovalMatrixRoles {...{ disabled, name }} />
        <FBApprovalMatrix {...{ disabled, handleAdd, name, mode, workspaceMode }} />
      </>
    </FBInput>
  </FBProvider>
);

export default withFBApprovalMatrixField(FBApprovalMatrixField);
