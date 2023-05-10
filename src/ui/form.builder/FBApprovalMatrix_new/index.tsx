import React from 'react';
import Grid, { Mode, MODE_FIELD } from './components/Grid';
import useStyles from './components/Grid/styles';
import createSchema from './schema';
import { withFBApprovalMatrix } from './wrap';
import { FBApprovalMatrixProps } from './types';
import { FBApprovalMatrixTableRoleHead, FBDocTypeGroup } from '../FBApprovalMatrixTable/FBApprovalMatrixTable.types';

const FBApprovalMatrix: React.FC<FBApprovalMatrixProps> = (props) => {
  const { data, handleSave, disabled } = props;
  const { approvalMatrix = [], approvalRoles = [] } = data ?? {};
  const classes = useStyles();

  const schema = createSchema({
    data,
    cellBorderLeftClassName: classes.cellBorderLeft,
    cellARClassName: classes.cellAR,
    cellARHeaderClassName: classes.cellARHeader,
  });

  const defaultNewValue = {
    docType: {
      name: '',
      group: FBDocTypeGroup.OTHER,
      active: true,
      acronym: '',
      category: '',
      needsSignature: false,
      defaultTraining: false,
    },
    approvalRoles: {},
    [MODE_FIELD]: Mode.add,
  };
  Object.keys(FBApprovalMatrixTableRoleHead).forEach((key) => {
    defaultNewValue.approvalRoles[key] = new Array(approvalRoles.length).fill(false);
  });

  return (
    <Grid
      data={approvalMatrix}
      schema={schema}
      disabled={disabled}
      defaultNewValue={defaultNewValue}
      onSave={handleSave}
    />
  );
};

export default withFBApprovalMatrix(FBApprovalMatrix);
