import React from "react";
import { FBApprovalMatrix, FBApprovalMatrixFieldProps, FBApprovalMatrixRoles, FBProvider } from "..";
import { withFBApprovalMatrixField } from "./FBApprovalMatrixField.wrap";

const FBApprovalMatrixField: React.FunctionComponent<FBApprovalMatrixFieldProps> = ({
  approvalMatrixFieldState,
  disabled,
  name,
}) =>  (
  <FBProvider {...{ approvalMatrixFieldState }}>
    <FBApprovalMatrixRoles {...{ disabled, name }} />
    <FBApprovalMatrix {...{ disabled }} />
  </FBProvider>
);

export default withFBApprovalMatrixField(FBApprovalMatrixField);
