import { Box } from '@material-ui/core';
import cx from 'classnames';
import { find, findIndex } from 'lodash';
import React, { useMemo } from 'react';
import KendoDataGrid from '../../../components/KendoDataGrid/KendoDataGrid';
import { POApprovalMatrixLevel } from '../FBPOApprovalMatrix.types';
import createSchema from './schema';
import useStyles from './styles';
import { FBPOAMKendoTableProps, POApprovalMatrixLevelItem, RowClickEvent } from './types';
import { buildSignatureStages } from './utils';

const FBPOAMKendoTable: React.FC<FBPOAMKendoTableProps> = ({
  approvalLevels,
  signatureStages,
  employees,
  groups,
  handleEdit,
  disabled,
  disableFilter,
  isDocumentReleased,
}) => {
  const classes = useStyles();

  const onRowClick = ({ dataItem }: RowClickEvent) => {
    const { id } = dataItem;
    const index = findIndex(approvalLevels, { id });
    const item = find(approvalLevels, { id });
    handleEdit(index, item as POApprovalMatrixLevel);
  };

  const clickHandler = isDocumentReleased ? undefined : onRowClick;

  const schema = createSchema({
    onRowClick: clickHandler,
    disableFilter,
    signatureStages,
  });

  const data = useMemo(() => approvalLevels.map((level) => ({
    ...level,
    signatureStages: buildSignatureStages(level, employees, groups),
  })), [approvalLevels, groups, employees]);

  const isActive = !disabled;

  return (
    <Box className={classes.root}>
      <KendoDataGrid<POApprovalMatrixLevelItem>
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={data}
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        onRowClick={isDocumentReleased ? undefined : clickHandler}
      />
    </Box>
  );
};

export default FBPOAMKendoTable;
