import { FormControlLabel, Grid, Popover, Switch, Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { CompositeFilterDescriptor, FilterDescriptor, getter } from '@progress/kendo-data-query';
import {
  getSelectedState,
  GridDetailRowProps,
  GridFilterChangeEvent,
  GridPageChangeEvent,
  GridSelectionChangeEvent,
  GridToolbar,
} from '@progress/kendo-react-grid';
import cx from 'classnames';
import { debounce, isEmpty, isNull, replace } from 'lodash';
import React, {
  ChangeEvent,
  ChangeEventHandler,
  lazy,
  memo,
  ReactElement,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SortDirection, SortDirectionType } from 'react-virtualized';
import { translate } from '../../../../common/intl';
import KendoDataGrid from '../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { Colors } from '../../../layout/theme-next';
import { useBulkMigrationContext } from '../BulkMigtationContext';
import { MigrationStatus, SelectedItemDetails, SupplierScanResultRevision } from '../interface';
import { useBulkMigration } from '../useBulkMigration';
import {
  DATA_ITEM_KEY,
  DEFAULT_FILTER,
  EXPAND_FIELD,
  INITIAL_ROWS_COUNT,
  pagerSettings,
  SELECTED_FIELD,
} from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { Page } from './types';

const idGetter = getter(DATA_ITEM_KEY);

interface KendoRevsTableProps {
  scanId: string
  updateRevsTable: number
  handleSelectedRowsChange: (selected: SelectedItemDetails[]) => void
}

const KendoRevsTable: React.FunctionComponent<KendoRevsTableProps> = ({
  scanId,
  updateRevsTable,
  handleSelectedRowsChange,
}) => {
  const classes = useStyles();
  const [searchQueries, setSearchQueries] = React.useState<{ [key: string]: string }>({});
  const [sortOrder, setSortOrder] = React.useState<SortDirectionType>(SortDirection.DESC);
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
  const { selectedItems, setSelectedItems } = useBulkMigrationContext();

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

  const handleDataItemExpanded = useCallback((dataItem: SupplierScanResultRevision) => {
    const selectedId = dataItem.docRevId;
    setExpandedRevIDs((prevIds = []) =>
      prevIds.includes(selectedId) ? prevIds.filter((id) => id !== selectedId) : [...prevIds, selectedId],
    );
  }, []);

  useEffect(() => {
    handleSelectedRowsChange(selected);
  }, [selected.length]);

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedDetails: SelectedItemDetails[] = data.map((n) => ({
        docRevId: n.docRevId,
        action: n.proposedAction,
      }));
      setSelected(newSelectedDetails);
      setSelectedRows((prevSelectedRows = {}) => {
        const newSelectedRows = data.reduce<{ [id: string]: boolean }>(
          (rows, item) => ({ ...rows, [idGetter(item)]: true }),
          {},
        );
        return { ...prevSelectedRows, ...newSelectedRows };
      });

      // global state update - add current page all item
      const existingRevIds = new Set(selectedItems.map(item => item.docRevId));
      const uniqueNewItems = newSelectedDetails.filter(
        item => !existingRevIds.has(item.docRevId),
      );
      setSelectedItems((prev) => [...prev, ...uniqueNewItems]);
      return;
    }
    setSelected([]);
    setSelectedRows((prevSelectedRows = {}) => {
      const currentPageKeys = data.map(item => idGetter(item));
      const newSelectedRows = { ...prevSelectedRows };
      currentPageKeys.forEach(key => delete newSelectedRows[key]);
      return newSelectedRows;
    });

    // global state update - remove current page all item
    const revIds = new Set(data.map(item => item.docRevId));
    setSelectedItems((prev) =>
      prev.filter(item => !revIds.has(item.docRevId)),
    );
  };

  useEffect(() => {
    if (scanId) {
      const options = {
        offset: page.pageNumber,
        limit: page.take,
        orderBy,
        sortOrder,
        showActionableOnly: isShowActionableRows,
      };
      fetchScanSupplierRevisions(
        scanId,
        options,
        searchQueries,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRevsTable, scanId, searchQueries, page, orderBy, sortOrder, isShowActionableRows]);

  const handleChangePage = (event: GridPageChangeEvent) => {
    const {
      page: { skip, take },
    } = event;
    const pageNumber = skip / take;
    setPage({ skip, take, pageNumber });
  };

  const handleRequestSort = (event: ChangeEventHandler, property: string) => {
    const isAsc = orderBy === property && sortOrder === SortDirection.ASC;
    setSortOrder(isAsc ? SortDirection.DESC : SortDirection.ASC);
    setOrderBy(property);
  };

  const searchTextChange = (searchQueries: { [key: string]: string }) => {
    setSearchQueries(searchQueries);
  };

  const debounceSearch = useCallback(debounce(searchTextChange, 1000, { leading: true, trailing: true }), []);

  const filterChange = (event: GridFilterChangeEvent) => {
    const { filter } = event;
    const newSearchQueries = filter?.filters
      ? (filter?.filters as FilterDescriptor[]).reduce((queries, fiter) => {
        const { field = '', value } = fiter;
        return { ...queries, [field as string]: value };
      }, {})
      : {};

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
    const newSelectedDetails: SelectedItemDetails[] = data.reduce<SelectedItemDetails[]>((selectedDetails, item) => {
      if (newSelectedState[item.docRevId]) {
        return [...selectedDetails, { docRevId: item.docRevId, action: item.proposedAction }];
      }
      return selectedDetails;
    }, []);
    setSelected(newSelectedDetails);

    // global state update - current page selected/disselected item
    const isSelected = newSelectedState[dataItem.docRevId];
    const itemDetails = { docRevId: dataItem.docRevId, action: dataItem.proposedAction };
    let updatedSelectedItems;

    if (isSelected) {
      const exists = selectedItems.some(item => item.docRevId === itemDetails.docRevId);
      updatedSelectedItems = exists ? selectedItems : [...selectedItems, itemDetails];
    } else {
      updatedSelectedItems = selectedItems.filter(item => item.docRevId !== itemDetails.docRevId);
    }
    setSelectedItems(updatedSelectedItems);
  };

  const getRowColor = (row: SupplierScanResultRevision) => {
    if (row.status === MigrationStatus.IN_PROGRESS) {
      return Colors.warningHighlight;
    }

    if (row.status === MigrationStatus.FAILED) {
      return Colors.errorLightShadow;
    }

    if (row.status === MigrationStatus.COMPLETED) {
      return Colors.successHighlight;
    }

    if (row.isMapped) {
      return Colors.primaryHighlight;
    }

    return Colors.darkGray;
  };

  const rowRender: DataGridProps<SupplierScanResultRevision>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as SupplierScanResultRevision;

    const editedRow = React.cloneElement(row, {
      className: cx(replace(row?.props?.className, 'k-alt', ''), { [classes.selectedRow]: item.isSelected }),
      style: { ...row?.props?.style, backgroundColor: !item.isSelected ? getRowColor(item) : '' },
    });

    return editedRow;
  };

  const RevList = data.map((item) => ({
    ...item,
    [SELECTED_FIELD]: Boolean(selectedRows?.[idGetter(item)]),
    [EXPAND_FIELD]: expandedRevIDs?.includes(item.docRevId),
  }));

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
      <KendoDataGrid<SupplierScanResultRevision>
        data={RevList as SupplierScanResultRevision[]}
        schema={schema}
        fullWidth
        className={classes.rootRevsList}
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
        <GridToolbar>
          {!isEmpty(errorMessage) && <div className={classes.errMsgStyle}>{errorMessage}</div>}
          <Grid
            container
            justify="space-between"
            className={cx({ [classes.revsTableSelectedHighlight]: selected.length > 0 })}
          >
            <Grid item className={classes.revsTableRefreshBox}>
              <Typography variant="h4" id="tableTitle" className={classes.revsTableRefreshText} component="div">
                {translate('administration.bulk.migration.supplier.rev.grid.title')}
                <RefreshIcon
                  className={classes.revsTableRefreshIcon}
                  onClick={() =>
                    fetchScanSupplierRevisions(
                      scanId,
                      {
                        offset: page.pageNumber,
                        limit: page.take,
                        orderBy,
                        sortOrder,
                        showActionableOnly: isShowActionableRows,
                      }, searchQueries,
                    )
                  }
                />
              </Typography>
              {selected.length > 0 && (
                <Typography color="inherit" variant="subtitle1" component="div" className={classes.revsTableSelected}>
                  {translate('administration.bulk.migration.supplier.rev.selected', { length: selected.length })}
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
