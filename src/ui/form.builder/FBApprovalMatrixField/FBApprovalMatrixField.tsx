import React from "react";
import { FBApprovalMatrix, FBApprovalMatrixFieldProps, FBApprovalMatrixRoles, FBProvider } from "..";
import { FormContext } from "../../components/forms/FormContext";
import { withFBApprovalMatrixField } from "./FBApprovalMatrixField.wrap";

const FBApprovalMatrixField: React.FunctionComponent<FBApprovalMatrixFieldProps> = ({
  handleAdd,
  approvalMatrixFieldState,
  disabled,
  name,
  mode,
}) =>  (
  <FBProvider {...{ approvalMatrixFieldState }}>
    <FormContext.Provider value={{ submitOnChange: false }}>
      <FBApprovalMatrixRoles {...{ disabled, name }} />
      <FBApprovalMatrix {...{ disabled, handleAdd, name, mode }} />
    </FormContext.Provider>
  </FBProvider>
);

export default withFBApprovalMatrixField(FBApprovalMatrixField);
