import React from 'react';
import Grid, { GridProps, Mode, MODE_FIELD } from './components/Grid';
import useStyles from './components/Grid/styles';
import createSchema from './schema';
import { withFBApprovalMatrix } from './wrap';
import { FBApprovalMatrixProps } from './types';
import { FBApprovalMatrixTableRoleHead, FBDocTypeGroup } from '../FBApprovalMatrixTable/FBApprovalMatrixTable.types';
import { useSelector } from 'react-redux';
import { documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import { FBApprovalMatrixItem, FBApprovalRolesStages } from '../FBApprovalMatrixField/FBApprovalMatrixField.types';

const FBApprovalMatrix: React.FC<FBApprovalMatrixProps> = (props) => {
  const { data, handleSave, disabled } = props;
  const { approvalMatrix = [], approvalRoles = [] } = data ?? {};
  const classes = useStyles();

  const documentTypeCategories = useSelector(documentTypeSelectors.getDocumentTypeCategoryList);

  const schema = createSchema({
    data,
    documentTypeCategories,
    cellBorderLeftClassName: classes.cellBorderLeft,
    cellARClassName: classes.cellAR,
    cellARHeaderClassName: classes.cellARHeader,
  });

  const defaultNewValue: GridProps<FBApprovalMatrixItem>['defaultNewValue'] = {
    docType: {
      name: '',
      group: FBDocTypeGroup.OTHER,
      active: true,
      acronym: '',
      category: '',
      needsSignature: false,
      defaultTraining: false,
    },
    approvalRoles: Object.keys(FBApprovalMatrixTableRoleHead).reduce(
      (acc, key) => {
        acc[key] = new Array(approvalRoles.length).fill(false);
        return acc;
      },
      {},
    ) as FBApprovalRolesStages,
    [MODE_FIELD]: Mode.add,
  };

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
