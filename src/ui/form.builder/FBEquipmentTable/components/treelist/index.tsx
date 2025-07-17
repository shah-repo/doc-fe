import {
  Grid,
} from '@material-ui/core';
import { FilterDescriptor } from '@progress/kendo-data-query';
import { GridToolbar } from '@progress/kendo-react-grid';
import {
  extendDataItem,
  filterBy,
  mapTree,
  orderBy, TreeList,
  TreeListCellProps, TreeListDataStateChangeEvent, TreeListDraggableRow, TreeListFilterChangeEvent,
} from '@progress/kendo-react-treelist';
import { ScrollMode } from '@progress/kendo-react-treelist/dist/npm/ScrollMode';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import {
  chain, isEmpty,
  map, replace, uniq,
} from 'lodash';
import { useObserver } from 'mobx-react';
import * as React from 'react';
import { SM } from '../../../../../App';
import { translate } from '../../../../../common/intl';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import { ColumnMenuContext, CustomColumnMenu } from '../../../../components/common/treelist/column.templates/CustomColumnMenu';
import { CustomTreeListColumnProps } from '../../../../components/common/treelist/types';
import useDialog from '../../../../hooks/useDialog';
import { withThemeNext } from '../../../../layout/theme-next';
import FBSection from '../../../FBSection/FBSection';
import { EditableEquipmentItem, EquipmentItem, EquipmentItemEditEvent } from '../../interface';
import {
  ADD_FIELD,
  DATA_ITEM_KEY,
  EquipTableDtata,
  EXPAND_FIELD,
  MODE_FIELD, SUB_ITEMS_FIELD,
  TREELIST_CONFIG,
} from './constants';
import {
  CustomTreeListExpandChangeEvent,
  CustomTreeListRowProps,
  EquipmentItemState,
  FBAllocationProps,
} from './interface';
import { TreeListSchema } from './schema';
import useStyles from './styles';

const FBEquipmentTable: React.FC<FBAllocationProps> = ({
  documentRevision,
  isDisabled,
  isShowOnly = false,
}) => {
  const { _tabsState } = SM.useStores();
  const { useRef } = React;
  const treeListRef = useRef(null);
  const size = useObserver(() => _tabsState?.contentSize);
  const { _documentRevisionFormState } = SM.useStores();
  const isDocument = !isEmpty(documentRevision?.formTemplate);

  const classes = useStyles({ size });
  const alertDialog = useDialog();

  const onConfirmDelete = () => {
    alertDialog.close();
  };

  const getAllItemIds = (items: EquipmentItem[]) => {
    if (!items) return [];
    const ids: string[] = [];
    items.forEach((item) => {
      ids.push(item.id);
    });
    return uniq(ids);
  };

  const [state, setState] = React.useState<EquipmentItemState>({
    data: EquipTableDtata,
    dataState: {
      sort: [],
      filter: [],
    },
    expanded: [],
    inEdit: [],
  });

  const formik = useFormik<Partial<EditableEquipmentItem>>({
    initialValues: {},
    onSubmit: (values: Partial<EditableEquipmentItem>) => {
      console.log({ values });
    },
  });

  const updateState = (stateInfo) => {
    _documentRevisionFormState?.setAllocationInfo(stateInfo);
    setState(stateInfo);
  };

  const schema: CustomTreeListColumnProps[] = TreeListSchema({
    actionsClass: classes.actionsCell,
    popperHolder: classes.popperHolder,
    parentRevId: documentRevision?.id,
    onConfirm: formik.submitForm,
  });

  const [columns, setColumns]
    = React.useState<CustomTreeListColumnProps[]>(schema);

  const onExpandChange = (event: CustomTreeListExpandChangeEvent) => {
    const expanded = event.value
      ? state.expanded.filter((id) => id !== event.dataItem.id)
      : uniq([...state.expanded, event.dataItem.id]);

    updateState({
      ...state,
      expanded,
    });
  };

  const handleDataStateChange = (event: TreeListDataStateChangeEvent) => {
    updateState({
      ...state,
      dataState: event.dataState,
    });
  };

  const addExpandField = (dataTree: EquipmentItem[]) => {
    const { expanded, inEdit } = state;
    return mapTree(dataTree, SUB_ITEMS_FIELD, (item) =>
      extendDataItem(item, SUB_ITEMS_FIELD, {
        [EXPAND_FIELD]: expanded.includes(item.id),
        [MODE_FIELD]: Boolean(inEdit.find((i) => i.id === item.id)),
      }),
    );
  };

  const processData = () => {
    const { data, dataState } = state;
    if (!dataState) {
      state.dataState = {
        sort: [],
        filter: [],
      };
      return [];
    }

    const filter = [...(dataState.filter as FilterDescriptor[])];
    const filteredData
      = dataState.filter && filterBy(data, filter, SUB_ITEMS_FIELD);
    const sortedData
      = dataState.sort
      && filteredData
      && orderBy(filteredData, dataState?.sort, SUB_ITEMS_FIELD);

    return addExpandField(sortedData as EquipmentItem[]);
  };

  const onColumnShowHide = ({ field }: CustomTreeListColumnProps) => {
    const dataColumns = map(columns, (column: CustomTreeListColumnProps) => {
      if (column.field === field) {
        column.isHidden = !column.isHidden;
      }
      return column;
    });
    updateColumns(dataColumns);
  };

  const ignorePreviouslyAddedItems = (data: EquipmentItem[]) => {
    return data?.filter((data) => {
      const isAlocationItemAddExist = !data[ADD_FIELD];
      if (data[SUB_ITEMS_FIELD]) {
        data[SUB_ITEMS_FIELD] = data[SUB_ITEMS_FIELD]?.filter((lot) => !lot[ADD_FIELD]);
      }
      return isAlocationItemAddExist;
    });
  };

  const editAllocationItem = ({ dataItem, level }: EquipmentItemEditEvent) => {
    if (dataItem.inEdit || isDisabled || isDocument) {
      return;
    }

    _documentRevisionFormState?.setDirty(true);
    const index = state?.data?.findIndex(data => { return data.id === dataItem.id; });

    const editItemInfo = extendDataItem(dataItem, SUB_ITEMS_FIELD);
    if (editItemInfo.lotRevId) {
      editItemInfo.isLotAddition = true;
    }
    state.data = ignorePreviouslyAddedItems(state.data);

    if (!dataItem[ADD_FIELD] && state.data.length && index !== -1) {
      state.data[index] = editItemInfo;
    }

    updateState({
      ...state,
      data: [...state.data],
      inEdit: [editItemInfo],
    });
    formik.setValues(editItemInfo);
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableEquipmentItem;
    // const parentChildRelkey = item.parentPartRevId ? `alloc-row-${item?.lotDocId}` : `alloc-row-${item.partRevId}-${item?.docId}`;

    const modifiedProps = {
      className: cx(replace(row?.props?.className, 'k-alt', ''), {
        [classes.WhiteBg]: isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.grayBg]: !isEmpty(item[SUB_ITEMS_FIELD]),
      }),
    };

    const showWithoutActions = !item[MODE_FIELD];

    if (showWithoutActions) {
      return React.cloneElement(row, {
        ...modifiedProps,
        ['data-cy' as string]: `alloc-row-${item?.id}`,
        // ['data-parent-rel' as string]: parentChildRelkey,
      });
    }

    return React.cloneElement(
      row,
      {
        ...modifiedProps,
        ['data-cy' as string]: `alloc-row-${item?.id}`,
        // ['data-parent-rel' as string]: parentChildRelkey,
        className: cx(row.props.className, classes.updatingRow),
      },
    );
  };

  const handleExpandAll = () => {
    const { data } = state;
    const expanded = getAllItemIds(data);
    updateState({
      ...state,
      expanded,
    });
  };

  const handleCollapseAll = () => {
    updateState({
      ...state,
      expanded: [],
    });
  };

  const renderToolbar = (
    <GridToolbar>
      <Grid
        container
        justify="space-between"
        className={classes.toolbarContainer}
      >
        <Grid
          item
          data-cy="collapse-expand-collapse"
          className={cx(classes.toggleExpandCollapse, {
            [classes.disabled]: isShowOnly,
          })}
          alignItems="center"
          justify="center"
        >
          <span onClick={handleExpandAll}>
            {translate('common.expand.all')} /{' '}
          </span>
          <span onClick={handleCollapseAll}>
            {translate('common.collapse.all')}
          </span>
        </Grid>
      </Grid>
    </GridToolbar>
  );

  const cellRender = (
    tdElement: React.ReactElement<
    HTMLTableCellElement,
    string | React.JSXElementConstructor<any>
    > | null,
    cellProps: TreeListCellProps,
  ): React.ReactElement<HTMLTableCellElement> => {
    const props = {
      ...tdElement?.props,
      className: cx(tdElement?.props.className, classes.borderBottom),
    };
    const defaultRendering = { ...tdElement, props: props };
    return defaultRendering as React.ReactElement<HTMLTableCellElement>;
  };

  const updateColumns = (columns: CustomTreeListColumnProps[]) => {
    setColumns(columns);
  };

  const getColumns = () => {
    return columns.filter(({ isHidden }) => !isHidden) ?? [];
  };

  const onFilterChange = (event: TreeListFilterChangeEvent) => {
    const { dataState, data } = state;
    dataState.filter = event.filter;
    const expanded = getAllItemIds(data);
    updateState({
      ...state,
      dataState: dataState,
      expanded: isEmpty(event.filter) ? [data[0]?.id] : expanded,
    });
  };

  const onLock = React.useCallback(
    ({
      field,
      locked,
    }: CustomTreeListColumnProps) => {
      const index = columns.findIndex((c) => c.field === field);
      const column = columns[index];
      if (column) {
        const newColumns = [...columns];
        newColumns.splice(index, 1, {
          ...column,
          locked: !locked,
          reorderable: locked,
          orderIndex: !locked ? 0 : undefined,
        });
        updateColumns(newColumns);
      }
    },
    [columns],
  );

  const orderByLockedState = (
    columnDefinitions: CustomTreeListColumnProps[],
  ): CustomTreeListColumnProps[] => {
    return chain([...columnDefinitions])
      .orderBy(['locked'], ['desc'])
      .value();
  };

  const sortedColumnDefinitions = orderByLockedState(getColumns());

  return (
    <div className={classes.root} data-cy="lhr-equipment-table">
      <Grid item>
        <FBSection label={translate('lhr.equipment.table.title')} data-cy="lhr-equipment-title" />
        <FormikProvider value={formik}>
          <ColumnMenuContext.Provider
            value={{
              columns: getColumns(),
              onLock,
              onColumnShowHide,
            }}
          >
            <Grid container>
              <Grid item xs={12} ref={treeListRef}>
                <TreeList
                  style={{
                    overflow: 'auto',
                    height: size?.height ? `${size?.height}px` : '100px',
                  }}
                  {...state.dataState}
                  tableProps={{ style: { tableLayout: 'fixed' } }}
                  rowHeight={TREELIST_CONFIG.rowHeight}
                  scrollable={TREELIST_CONFIG.scrollable as ScrollMode}
                  editField={MODE_FIELD}
                  expandField={EXPAND_FIELD}
                  dataItemKey={DATA_ITEM_KEY}
                  subItemsField={SUB_ITEMS_FIELD}
                  className={cx(classes.treeList, 'containing-box-scrollbar')}
                  onExpandChange={onExpandChange}
                  rowRender={rowRender}
                  data={processData()}
                  onDataStateChange={handleDataStateChange}
                  columns={sortedColumnDefinitions}
                  columnMenu={(props) => (
                    <CustomColumnMenu
                      {...props}
                      columns={getColumns()}
                      {...{
                        onLock,
                        onColumnShowHide,
                      }}
                    />
                  )}
                  onRowClick={editAllocationItem}
                  onFilterChange={onFilterChange}
                  resizable={TREELIST_CONFIG.resizable}
                  reorderable={TREELIST_CONFIG.reorderable}
                  sortable={TREELIST_CONFIG.sortable}
                  toolbar={renderToolbar}
                  cellRender={cellRender}
                  row={TreeListDraggableRow}
                />
              </Grid>
            </Grid>
          </ColumnMenuContext.Provider>
        </FormikProvider>
      </Grid>
      <AlertDialog
        confirmAction={onConfirmDelete}
        cancelAction={alertDialog.close}
        confirmLabel="common.yes.proceed"
        cancelLabel="common.cancel"
        message="allocation.lot.delete.confirmation"
        dialog={alertDialog}
      />
    </div>
  );
};

export default React.memo(withThemeNext(React.forwardRef(FBEquipmentTable)));
