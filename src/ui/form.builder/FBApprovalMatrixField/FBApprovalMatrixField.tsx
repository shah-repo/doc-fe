import React from 'react';
import { FBApprovalMatrix, FBApprovalMatrixFieldProps, FBDAMFields, FBInput, FBProvider } from '..';
import { withFBApprovalMatrixField } from './FBApprovalMatrixField.wrap';

const FBApprovalMatrixField: React.FunctionComponent<FBApprovalMatrixFieldProps> = ({
  handleAdd,
  approvalMatrixFieldState,
  disabled,
  autosave,
  name = FBDAMFields.DAM,
  mode,
  workspaceMode,
}) => (
  <FBProvider {...{ approvalMatrixFieldState }}>
    <FBInput {...{ name, disabled, autosave }} type="approvalMatrix">
      <FBApprovalMatrix {...{ disabled, handleAdd, name, mode, workspaceMode }} />
    </FBInput>
  </FBProvider>
);

export default withFBApprovalMatrixField(FBApprovalMatrixField);
