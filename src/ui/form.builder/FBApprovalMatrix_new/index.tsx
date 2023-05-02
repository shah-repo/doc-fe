import React from 'react';
import Grid from './components/Grid';
import { withFBApprovalMatrix } from './wrap';
import { FBApprovalMatrixProps } from './types';

const FBApprovalMatrix: React.FC<FBApprovalMatrixProps> = (props) => {
  const { data, handleSave, disabled } = props;

  return (
    <Grid
      data={data}
      disabled={disabled}
      onSave={handleSave}
    />
  );
};

export default withFBApprovalMatrix(FBApprovalMatrix);
