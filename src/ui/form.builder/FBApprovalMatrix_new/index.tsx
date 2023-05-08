import React from 'react';
import Grid from './components/Grid';
import createSchema from './schema';
import { withFBApprovalMatrix } from './wrap';
import { FBApprovalMatrixProps } from './types';

// @todo: approval roles

const FBApprovalMatrix: React.FC<FBApprovalMatrixProps> = (props) => {
  const { data, handleSave, disabled } = props;
  const { approvalMatrix = [] } = data ?? {};

  const schema = createSchema(data);

  return (
    <Grid
      data={approvalMatrix}
      schema={schema}
      disabled={disabled}
      onSave={handleSave}
    />
  );
};

export default withFBApprovalMatrix(FBApprovalMatrix);
