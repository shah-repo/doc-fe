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
}) =>  (
  <FBProvider {...{ approvalMatrixFieldState }}>
    <FBInput {...{ name, disabled, autosave }} type="approvalMatrix">
      <>
        <FBApprovalMatrixRoles {...{ disabled, name }} />
        <FBApprovalMatrix {...{ disabled, handleAdd, name, mode }} />
      </>
    </FBInput>
  </FBProvider>
);

export default withFBApprovalMatrixField(FBApprovalMatrixField);
