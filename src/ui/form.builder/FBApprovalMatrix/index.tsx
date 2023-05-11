import React from 'react';
import Grid, { Mode, MODE_FIELD } from './components/Grid';
import { GridProps } from './components/Grid/types';
import useStyles from './components/Grid/styles';
import createSchema from './schema';
import { withFBApprovalMatrix } from './wrap';
import { useSelector } from 'react-redux';
import { documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import { FBApprovalMatrixProps, FBApprovalMatrixRoleTitles, FBApprovalMatrixItem, FBApprovalRolesStages, FBDocTypeGroup } from '..';

const GridTable = Grid as React.ComponentType<GridProps<FBApprovalMatrixItem>>;

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
    approvalRoles: Object.keys(FBApprovalMatrixRoleTitles).reduce(
      (acc, key) => {
        acc[key] = new Array(approvalRoles.length).fill(false);
        return acc;
      },
      {},
    ) as FBApprovalRolesStages,
    [MODE_FIELD]: Mode.add,
  };

  return (
    <GridTable
      data={approvalMatrix}
      schema={schema}
      disabled={disabled}
      defaultNewValue={defaultNewValue}
      onSave={handleSave}
    />
  );
};

export default withFBApprovalMatrix(FBApprovalMatrix);
