import { Box } from '@material-ui/core';
import cx from 'classnames';
import { find, findIndex } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import KendoDataGrid from '../../../components/KendoDataGrid/KendoDataGrid';
import NoDataFound from '../../../components/common/kendo/NoDataFound';
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

  const onRowClick = useCallback(({ dataItem }: RowClickEvent) => {
    const { id } = dataItem;
    const index = findIndex(approvalLevels, { id });
    const item = find(approvalLevels, { id });
    if (item) {
      handleEdit(index, item);
    }
  }, [approvalLevels, handleEdit]);

  const isActive = !disabled;
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

  return (
    <Box className={classes.root}>
      <KendoDataGrid<POApprovalMatrixLevelItem>
        fullWidth
        filterable={!disableFilter}
        hasBoxScrollbars
        schema={schema}
        data={data}
        fallback={<NoDataFound />}
        className={cx(classes.grid, { [classes.gridWithButton]: isActive, [classes.gridPreview]: disableFilter })}
        onRowClick={clickHandler}
      />
    </Box>
  );
};

export default FBPOAMKendoTable;
