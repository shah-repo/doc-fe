import React from "react";
import { FBApprovalMatrixNew, FBApprovalMatrixFieldProps, FBInput, FBProvider } from "..";
import { withFBApprovalMatrixField } from "./FBApprovalMatrixField.wrap";

const FBApprovalMatrixField: React.FunctionComponent<FBApprovalMatrixFieldProps> = ({
  handleAdd,
  approvalMatrixFieldState,
  disabled,
  autosave,
  name = "dam-built-in",
  mode,
  workspaceMode,
}) =>  (
  <FBProvider {...{ approvalMatrixFieldState }}>
    <FBInput {...{ name, disabled, autosave }} type="approvalMatrix">
      <FBApprovalMatrixNew {...{ disabled, handleAdd, name, mode, workspaceMode }} />
    </FBInput>
  </FBProvider>
);

export default withFBApprovalMatrixField(FBApprovalMatrixField);
