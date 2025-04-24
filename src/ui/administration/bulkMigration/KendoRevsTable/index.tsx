import { FormControlLabel, Grid, Popover, Switch, Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { CompositeFilterDescriptor, FilterDescriptor, getter } from '@progress/kendo-data-query';
import { getSelectedState, GridDetailRowProps, GridFilterChangeEvent, GridPageChangeEvent, GridSelectionChangeEvent, GridToolbar } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { debounce, isEmpty, isNull, replace } from 'lodash';
import React, { ChangeEvent, ChangeEventHandler, lazy, memo, ReactElement, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { translate } from '../../../../common/intl';
import KendoDataGrid from '../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import UtilColors from '../../../layout/theme/utils/colors';
import { ISelectedDetails, ISupplierScanResultRev, MIGRATION_STATUS_ENUM, SortDirection } from '../interface';
import { useBulkMigration } from '../useBulkMigration';
import { DATA_ITEM_KEY, DEFAULT_FILTER, EXPAND_FIELD, pagerSettings, SELECTED_FIELD } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { Page } from './types';

const idGetter = getter(DATA_ITEM_KEY);

interface props {
  scanId: string
  updateRevsTable: number
  handleSelectedRowsChange: (selected: ISelectedDetails[]) => void
}

const INITIAL_ROWS_COUNT = 25;

const KendoRevsTable: React.FunctionComponent<props> = (
  { scanId, updateRevsTable, handleSelectedRowsChange }) => {
  const classes = useStyles();
  const [searchQueries, setSearchQueries] = React.useState<{[key: string]: string}>({});
  const [order, setOrder] = React.useState<SortDirection>('desc');
  const [orderBy, setOrderBy] = React.useState('createdAt');
  const [page, setPage] = React.useState<Page>({ skip: 0, pageNumber: 0, take: INITIAL_ROWS_COUNT });
  const [isShowActionableRows, setIsShowActionableRows] = useState<boolean>(true);
  const [expandedRevIDs, setExpandedRevIDs] = useState<string[]>([]);
  const [filter, setFilter] = useState<CompositeFilterDescriptor>();

  const {
    isLoading,
    errorMessage,
    rows: data,
    totalCount,
    fetchScanSupplierRevisions,
    selected,
    setSelected,
  } = useBulkMigration();
  const containerRef = useRef<HTMLDivElement>(null);
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

  const handleDataItemExpanded = useCallback((dataItem: ISupplierScanResultRev) => {
    const selectedId = dataItem.docRevId;
    setExpandedRevIDs((prevIds = []) =>
      prevIds.includes(selectedId)
        ? prevIds.filter(id => id !== selectedId)
        : [...prevIds, selectedId],
    );
  }, []);

  useEffect(() => {
    handleSelectedRowsChange(selected);
  }, [selected.length]);

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedDetails: ISelectedDetails[] = data.map((n) => ({ docRevId: n.docRevId, action: n.proposedAction }));
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
      fetchScanSupplierRevisions(scanId, page.pageNumber, page.take, orderBy, order, isShowActionableRows, searchQueries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRevsTable, scanId, searchQueries, page, orderBy, order, isShowActionableRows]);

  const handleChangePage = (event: GridPageChangeEvent) => {
    const { page: { skip, take } } = event;
    const pageNumber = skip / take;
    setPage({ skip, take, pageNumber });
  };

  const handleRequestSort = (event: ChangeEventHandler, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const searchTextChange = (searchQueries: {[key: string]: string}) => {
    setSearchQueries(searchQueries);
  };

  const debounceSearch = useCallback(debounce(searchTextChange, 1000, { leading: true, trailing: true }), []);

  const filterChange = (event: GridFilterChangeEvent) => {
    const { filter } = event;
    const newSearchQueries = filter?.filters ? (filter?.filters as FilterDescriptor[]).reduce((queries, fiter) => {
      const { field = '', value } = fiter;
      return { ...queries, [field as string]: value };
    }, {}) : {};

    setFilter(filter ?? DEFAULT_FILTER);
    debounceSearch(newSearchQueries);
  };

  const schema = buildSchema({
    scanId,
    rowCount: data.length,
    numSelected: selected.length,
    handleHeaderCheckedChange: handleSelectAllClick,
    handlePopoverOpen,
    handlePopoverClose,
    handleRequestSort,
    onDataItemExpanded: handleDataItemExpanded,
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
      if (newSelectedState[item.docRevId]) {
        return [...selectedDetails, { docRevId: item.docRevId, action: item.proposedAction }];
      }
      return selectedDetails;
    }, []);
    setSelected(newSelectedDetails);
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

  const RevList = data.map((item) => ({ ...item, [SELECTED_FIELD]: Boolean(selectedRows?.[idGetter(item)]), [EXPAND_FIELD]: expandedRevIDs?.includes(item.docRevId) }));

  const LazyDetailComponent = lazy(async () => await import('./FormInputComparison'));

  const DetailComponent = memo((props: GridDetailRowProps) => {
    return (
      <Suspense fallback={<div>{translate('common.loading')}</div>}>
        <LazyDetailComponent {...props} />
      </Suspense>
    );
  });

  return (
    <div ref={containerRef} className={classes.root} data-cy="tasks-list-table">
      <KendoDataGrid<ISupplierScanResultRev>
        style={{ overflow: 'auto', maxHeight: '53vh' }}
        data={RevList as ISupplierScanResultRev[]}
        schema={schema}
        fullWidth
        className={classes.rootTasksList}
        hasBoxScrollbars
        scrollable="scrollable"
        filterable={true}
        loading={isLoading}
        selectedField={SELECTED_FIELD}
        dataItemKey={DATA_ITEM_KEY}
        detail={DetailComponent}
        expandField={EXPAND_FIELD}
        rowRender={rowRender}
        containerRef={containerRef}
        resizable={true}
        onSelectionChange={onSelectionChange}
        pageable={pagerSettings}
        onPageChange={handleChangePage}
        skip={page.skip}
        take={page.take}
        total={totalCount}
        onFilterChange={filterChange}
        filter={filter}
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
                  onClick={() => fetchScanSupplierRevisions(scanId, page.pageNumber, page.take, orderBy, order, isShowActionableRows, searchQueries)}
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
