import { FormControlLabel, Grid, Popover, styled, Switch, TablePagination, Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { getter } from '@progress/kendo-data-query';
import { getSelectedState, GridSelectionChangeEvent, GridToolbar } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { isEmpty, isNull, replace } from 'lodash';
import React, { ChangeEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { translate } from '../../../../common/intl';
import { ChangeRequestStatus } from '../../../../state/ducks/changeRequest/types';
import { DocumentRevisionStatus } from '../../../../state/ducks/documentRevisions/types';
import KendoDataGrid from '../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { checkIsDocumentWO, checkIsTypeHaveOutput } from '../../../documentRevision/helpers/checkDocumentGroup';
import { FB } from '../../../form.builder';
import UtilColors from '../../../layout/theme/utils/colors';
import { ISelectedDetails, ISupplierScanResultRev, MIGRATION_STATUS_ENUM, SortDirection } from '../interface';
import { useBulkMigration } from '../useBulkMigration';
import { DATA_ITEM_KEY, SELECTED_FIELD } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';

const idGetter = getter(DATA_ITEM_KEY);

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  '& .MuiTablePagination-selectIcon': {
    left: theme.spacing(3),
    top: theme.spacing(1.2),
  },
}));

interface props {
  scanId: string
  updateRevsTable: number
  state?: ChangeRequestStatus | DocumentRevisionStatus
  isShowOnly?: boolean
  disabled?: boolean
  label?: string
  isAdditionalColumnsShown?: boolean
  setDoNotPrompt?: (state: boolean) => void
}

const INITIAL_ROWS_COUNT = 25;

const KendoRevsTable: React.FunctionComponent<props> = (
  { scanId, updateRevsTable, label, state, isShowOnly = false, isAdditionalColumnsShown, setDoNotPrompt, disabled }) => {
  const classes = useStyles();
  isShowOnly = (isShowOnly || disabled) ?? false;

  const [searchQueries, setSearchQueries] = React.useState<{[key: string]: string}>({});
  const [order, setOrder] = React.useState<SortDirection>('desc');
  const [orderBy, setOrderBy] = React.useState('createdAt');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(INITIAL_ROWS_COUNT);
  const [isShowActionableRows, setIsShowActionableRows] = useState<boolean>(true);

  const {
    isLoading,
    errorMessage,
    rows,
    totalCount,
    fetchScanSupplierRevisions,
    selected,
    setSelected,
  } = useBulkMigration();
  const { workspaceState } = FB.useStores();
  const containerRef = useRef<HTMLDivElement>(null);

  const groupOptions = workspaceState?.document?.document?.documentType?.groupOptions;
  const isWORecord = checkIsDocumentWO(groupOptions) && !checkIsTypeHaveOutput(groupOptions);
  const enbleTasksAdditionalColumns = isWORecord && DocumentRevisionStatus.Draft !== workspaceState?.document?.status;
  const [data, setData] = React.useState<ISupplierScanResultRev[]>(rows);
  const [selectedRows, setSelectedRows] = React.useState<{ [id: string]: boolean | number[] }>();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popoverContent, setPopoverContent] = useState<ReactElement>(<></>);

  const handlePopoverOpen = (event, content) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(content);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverContent(<></>);
  };

  useEffect(() => {
    setData(rows);
  }, [rows]);

  if (enbleTasksAdditionalColumns) {
    isAdditionalColumnsShown = true;
  }

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedDetails: ISelectedDetails[] = data.map((n) => ({ id: n.docRevId, action: n.proposedAction }));
      setSelected(newSelectedDetails);
      const newSelectedRows = data.reduce<{ [id: string]: boolean }>((selectedRows, item) => ({ ...selectedRows, [idGetter(item)]: true }), {});
      setSelectedRows(newSelectedRows);
      return;
    }
    setSelected([]);
    setSelectedRows(undefined);
  };

  useEffect(() => {
    if (scanId) {
      fetchScanSupplierRevisions(scanId, page, rowsPerPage, orderBy, order, isShowActionableRows, searchQueries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRevsTable, scanId, searchQueries, page, rowsPerPage, orderBy, order, isShowActionableRows]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchTextChange = (value: string, propertyId: string) => {
    const newSearchQueries = {
      ...searchQueries, [propertyId]: value,
    };
    setSearchQueries(newSearchQueries);
  };

  console.log({ handleSearchTextChange, handleRequestSort });

  // const formik = useFormik({
  //   initialValues: {},
  //   onSubmit: (values) => {
  //     console.log({ values });
  //   },
  // });

  const isWOReleased = isWORecord && DocumentRevisionStatus.Released === workspaceState?.document?.status;
  const isWOVoided = isWORecord && DocumentRevisionStatus.Voided === workspaceState?.document?.status;
  const isClosed = isWORecord ? (isWOReleased || isWOVoided) : Boolean(state && [DocumentRevisionStatus.Released, ChangeRequestStatus.Closed].includes(state));
  const schema = buildSchema({
    isDisabled: isWORecord ? isWOReleased : ChangeRequestStatus.Closed === state,
    isClosed,
    rowCount: data.length,
    numSelected: selected.length,
    handleHeaderCheckedChange: handleSelectAllClick,
    handlePopoverOpen,
    handlePopoverClose,
  });

  const onSelectionChange = (event: GridSelectionChangeEvent) => {
    const { dataItem } = event;
    if (isNull(dataItem)) {
      return;
    }
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedRows ?? {},
      dataItemKey: DATA_ITEM_KEY,
    });
    setSelectedRows(newSelectedState);
    const newSelectedDetails: ISelectedDetails[] = data.reduce<ISelectedDetails[]>((selectedDetails, item) => {
      if (newSelectedState[item.id]) {
        return [...selectedDetails, { id: item.docRevId, action: item.proposedAction }];
      }
      return selectedDetails;
    }, []);
    setSelected(newSelectedDetails);
  };

  const getColumns = () => {
    return schema.filter(({ show }) => show || isAdditionalColumnsShown);
  };

  const getRowColor = (row: ISupplierScanResultRev) => {
    if (row.status === MIGRATION_STATUS_ENUM.IN_PROGRESS) {
      return UtilColors.inProgress;
    }

    if (row.status === MIGRATION_STATUS_ENUM.FAILED) {
      return UtilColors.failed;
    }

    if (row.status === MIGRATION_STATUS_ENUM.COMPLETED || row.isAlreadyUpgraded) {
      return UtilColors.done;
    }

    if (row.isMapped) {
      return UtilColors.alice_blue;
    }

    return UtilColors.default;
  };

  const rowRender: DataGridProps<ISupplierScanResultRev>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as ISupplierScanResultRev;

    const editedRow = React.cloneElement(
      row,
      {
        className: cx(replace(row?.props?.className, 'k-alt', ''), { [classes.selectedRow]: item.isSelected }),
        style: { ...row?.props?.style, backgroundColor: !item.isSelected ? getRowColor(item) : '' },
      },
    );

    return editedRow;
  };

  const RevList = data.map((item) => ({ ...item, [SELECTED_FIELD]: Boolean(selectedRows?.[idGetter(item)]) }));

  return (
    <div ref={containerRef} className={classes.root} data-cy="tasks-list-table">
      <KendoDataGrid<ISupplierScanResultRev>
        style={{ overflow: 'auto', maxHeight: '50vh' }}
        data={RevList as ISupplierScanResultRev[]}
        schema={getColumns()}
        fullWidth
        className={classes.rootTasksList}
        hasBoxScrollbars
        scrollable="scrollable"
        filterable={true}
        loading={isLoading}
        selectedField={SELECTED_FIELD}
        dataItemKey={DATA_ITEM_KEY}
        rowRender={rowRender}
        containerRef={containerRef}
        resizable={true}
        onSelectionChange={onSelectionChange}
      >
        <GridToolbar >
          {!isEmpty(errorMessage) && <div className={classes.errMsgStyle}>{errorMessage}</div>}
          <Grid container justify="space-between"
            className={cx({ [classes.revsTableSelectedHighlight]: selected.length > 0 })}
          >
            <Grid item className={classes.revsTableRefreshBox} >
              <Typography variant="h6" id="tableTitle" className={classes.revsTableRefreshText} component="div">
                {translate('administration.bulk.migration.supplier.rev.grid.title')}
                <RefreshIcon
                  className={classes.revsTableRefreshIcon}
                  onClick={() => fetchScanSupplierRevisions(scanId, page, rowsPerPage, orderBy, order, isShowActionableRows, searchQueries)}
                />
              </Typography>
              {selected.length > 0 && (
                <Typography color="inherit" variant="subtitle1" component="div" style={{ marginLeft: 16 }}>
                  {selected.length} selected
                </Typography>
              )}
            </Grid>
            <Grid item className={classes.revsTableActionableBox}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={isShowActionableRows}
                    onChange={(event) => setIsShowActionableRows(event.target.checked)}
                    color="primary"
                    classes={{
                      switchBase: classes.switchBase,
                    }}
                  />
                }
                label="Actionable Rows"
                className={classes.mappingSwitcher}
                labelPlacement="bottom"
              />
              <StyledTablePagination
                rowsPerPageOptions={[25, 50, 100]}
                SelectProps={{ fullWidth: false }}
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
        </GridToolbar>
      </KendoDataGrid>
      <Popover
        className={classes.noPointerEvents}
        classes={{
          paper: classes.revsTablePopoverPaper,
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {popoverContent}
      </Popover>
    </div>
  );
};

export default KendoRevsTable;
