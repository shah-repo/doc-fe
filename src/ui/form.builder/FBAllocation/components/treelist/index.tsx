import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
} from '@material-ui/core';
import { FilterDescriptor } from '@progress/kendo-data-query';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { GridToolbar } from '@progress/kendo-react-grid';
import {
  extendDataItem,
  filterBy,
  mapTree,
  orderBy, TreeList,
  TreeListCellProps,
  TreeListColumnReorderEvent,
  TreeListDataStateChangeEvent, TreeListDraggableRow, TreeListFilterChangeEvent, treeToFlat,
} from '@progress/kendo-react-treelist';
import { ScrollMode } from '@progress/kendo-react-treelist/dist/npm/ScrollMode';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import {
  chain, isEmpty, map, replace, uniq,
} from 'lodash';
import { useObserver } from 'mobx-react';
import * as React from 'react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { SM } from '../../../../../App';
import { translate } from '../../../../../common/intl';
import { getHasPermission, getTableCriteria } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { tableSearchActions } from '../../../../../state/ducks/tableSearch';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import { Button as AddButton } from '../../../../components/forms/fields-next';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';
import { disableOtherFieldsChangeControl, getEnabledFieldsForEditing, substitutingSupersededDisabledChangeControl } from '../../../../document.revision/utils/helpers';
import useDialog from '../../../../hooks/useDialog';
import { withThemeNext } from '../../../../layout/theme-next';
import { AllocationItem, AllocationItemEditEvent, EditableAllocationItem } from '../../interface';
import { ActionsCell } from './column.templates/Actions';
import {
  ColumnMenuContext,
  CustomColumnMenu,
} from './column.templates/CustomColumnMenu';
import ColumnShowHideTreeMenu from './common/ColumnShowHideTreeMenu';
import {
  ADD_FIELD,
  AllocationData,
  ALLOCATION_TABLE_NAME,
  CELL_EMPTY_VALUE,
  DATA_ITEM_KEY,
  DOC_ID_FIELD,
  EXCEL_FILE_NAME,
  EXPAND_FIELD,
  ID_FIELD,
  MODE_FIELD,
  SELECTED_PART_KEY_SEPARATOR,
  SUB_ITEMS_FIELD,
  TREELIST_CONFIG,
} from './constants';
import {
  AllocationState,
  CustomTreeListColumnProps,
  CustomTreeListExpandChangeEvent,
  CustomTreeListRowProps,
  FBAllocationProps,
} from './interface';
import { TreeListSchema } from './schema';
import useStyles from './styles';
import {
  processAllocationTableData,
  updateDataAtLevels,
} from './utils';

const FBAllocationTreeList: React.FC<FBAllocationProps> = ({
  documentRevision,
  isDisabled,
  isShowOnly = false,
  isUpgradeDisabled = false,
  isExpandAll = false,
}) => {
  const { _tabsState } = SM.useStores();
  const dispatch = useDispatch();
  const size = useObserver(() => _tabsState?.contentSize);
  const { _documentRevisionFormState } = SM.useStores();

  const classes = useStyles({ size });
  const [state, setState] = React.useState<AllocationState>(() => {
    const allocTreeRelations = AllocationData.allocTreeRelations ?? [];
    const allocProccessedData = processAllocationTableData(
      [...allocTreeRelations],
      AllocationData.parentRevDetails,
    );
    return {
      data: [...allocProccessedData],
      dataState: {
        sort: [],
        filter: [],
      },
      expanded: [],
      inEdit: [],
    };
  });
  const [selectedPartLevel, setSelectedPartLevel] = React.useState<{
    level: number[]
    dataItem: EditableAllocationItem
  }>();
  const treeListRef = useRef(null);

  isUpgradeDisabled = isUpgradeDisabled || substitutingSupersededDisabledChangeControl(documentRevision);
  const enabledFieldsForEditing = getEnabledFieldsForEditing(documentRevision);
  const inRestrictedEditMode = disableOtherFieldsChangeControl(documentRevision);
  const hasPermisstionToEditRestrictedPart = useSelector(getHasPermission(Permission.RESTRICTED_PART_EDIT_ADMIN));

  const updateState = (stateInfo) => {
    setState(stateInfo);
  };

  const createNewLotItem = () => {
    return {
      id: uuidv4(),
      lotAllocated: '',
      qtyNeeded: '',
      variance: '',
      issuedQty: '',
      qtyOnHandBefore: '',
      qtyOnHandAfter: '',
      itemId: '',
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
      isEditEnabled: true,
      isParentOwner: true,
      isLotAddition: true,
    };
  };

  const addLot = (dataItem) => {
    console.log('Add Lot', dataItem);
      _documentRevisionFormState?.setDirty(true);
      const newAllocItem: EditableAllocationItem = createNewLotItem();
      state.data[0][SUB_ITEMS_FIELD] = state.data[0][SUB_ITEMS_FIELD]?.filter(
        (data) => !data[ADD_FIELD],
      );
      state.data[0][SUB_ITEMS_FIELD]?.unshift(newAllocItem);
      updateState({
        ...state,
        data: [...state.data],
        expanded: [state.data[0].id],
        inEdit: [newAllocItem],
      });
  };

  const schema: CustomTreeListColumnProps[] = TreeListSchema({ addLot });

  const tableCriteria = useSelector(getTableCriteria(ALLOCATION_TABLE_NAME));

  React.useEffect(() => {
    if (tableCriteria?.columnConfig) {
      const savedColumns = JSON.parse(tableCriteria.columnConfig) as CustomTreeListColumnProps[];
      const updatedColumns = schema.map(schemaItem => {
        const savedColumn = savedColumns.find(column => schemaItem.field === column.field);
        return {
          ...schemaItem,
          orderIndex: savedColumn?.orderIndex,
          locked: savedColumn?.locked,
          isHidden: savedColumn?.isHidden,
        };
      });
      setColumns(updatedColumns);
      setState({ ...state, dataState: tableCriteria.queryDict.dataState });
    } else {
      updateColumns(schema);
    }
  }, []);

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

  const confirmationDialog = useDialog();

  const [selectedPart, setSelectedPart] = useState<EditableAllocationItem>();
  const confirmDeletePart = (e: React.MouseEvent<HTMLElement>) => {
    discardAllocItem(selectedPart);
    confirmationDialog.close();
  };

  const cancelDeletePart = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    confirmationDialog.close();
  };

  const addExpandField = (dataTree: AllocationItem[]) => {
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
    const filter = [...(dataState.filter as FilterDescriptor[])];
    const docIDField = filter?.find((val) => val.field === ID_FIELD);
    const docIDFieldIndex = filter?.findIndex((val) => val.field === ID_FIELD);

    if (docIDField) {
      filter?.splice(docIDFieldIndex, 1, {
        ...docIDField,
        field: DOC_ID_FIELD,
      });
    }
    const filteredData
      = dataState.filter && filterBy(data, filter, SUB_ITEMS_FIELD);
    const sortedData
      = dataState.sort
      && filteredData
      && orderBy(filteredData, dataState.sort, SUB_ITEMS_FIELD);
    return addExpandField(sortedData as AllocationItem[]);
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

  const formik = useFormik<Partial<EditableAllocationItem>>({
    initialValues: {},
    onSubmit: () => {
      // TO DO
    },
  });

  const createNewItem = () => {
    return {
      id: uuidv4(),
      lotAllocated: '',
      qtyNeeded: '',
      variance: '',
      issuedQty: '',
      qtyOnHandBefore: '',
      qtyOnHandAfter: '',
      itemId: '',
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
      isEditEnabled: true,
      isParentOwner: true,
    };
  };

  const addAllocationItem = () => {
    _documentRevisionFormState?.setDirty(true);
    const newAllocItem: EditableAllocationItem = createNewItem();
    state.data[0][SUB_ITEMS_FIELD] = state.data[0][SUB_ITEMS_FIELD]?.filter(
      (data) => !data[ADD_FIELD],
    );
    state.data[0][SUB_ITEMS_FIELD]?.push(newAllocItem);
    updateState({
      ...state,
      data: [...state.data],
      expanded: [state.data[0].id],
      inEdit: [newAllocItem],
    });
  };

  const editAllocationItem = ({ dataItem, level }: AllocationItemEditEvent) => {
    if (dataItem.id === documentRevision.id) {
      return;
    }

    if (dataItem.inEdit || !dataItem.isEditEnabled) {
      return;
    }

    if (!inRestrictedEditMode) {
      if (isDisabled || !dataItem.isParentOwner) {
        return;
      }
    }

    if (disableEditInRestrictedEditMode(dataItem)) {
      return;
    }

    _documentRevisionFormState?.setDirty(true);
    setSelectedPartLevel({ dataItem, level });
    if (!dataItem[ADD_FIELD]) {
      state.data = updateDataAtLevels(
        [...state.data],
        level,
        dataItem,
        false,
      ) as AllocationItem[];
    }
    const editItemInfo = extendDataItem(dataItem, SUB_ITEMS_FIELD);
    const childRevId = editItemInfo.id.split(SELECTED_PART_KEY_SEPARATOR)[0];
    editItemInfo.customDocId = `${childRevId}${SELECTED_PART_KEY_SEPARATOR}${editItemInfo.documentId}`;
    editItemInfo.childNodeRevId = childRevId;
    formik?.setFieldValue('revision', editItemInfo?.revision);
    updateState({
      ...state,
      data: [...state.data],
      inEdit: [editItemInfo],
    });
    formik.setValues(editItemInfo);
  };

  const discardAllocItem = (dataItem?) => {
    if (dataItem && dataItem[ADD_FIELD]) {
      if (selectedPartLevel?.level) {
        const updatedData = updateDataAtLevels(
          [...state.data],
          selectedPartLevel?.level,
          dataItem,
          false,
        ) as AllocationItem[];
        updateState({
          ...state,
          data: [...updatedData],
          expanded: [...state.expanded],
          inEdit: [],
        });
      }
      state.data[0][SUB_ITEMS_FIELD] = state.data[0][SUB_ITEMS_FIELD]?.filter(
        (data) => !data[ADD_FIELD],
      );
    }
    _documentRevisionFormState?.setDirty(false);
    updateState({
      ...state,
      inEdit: [],
    });

    formik?.resetForm();
  };

  const removeAllocItem = (dataItem) => {
    if (dataItem.isDisabled) {
      return;
    }
    confirmationDialog.open();
    setSelectedPart(dataItem);
  };

  const disableEditInRestrictedEditMode = (item) => {
    return inRestrictedEditMode && ((!item.isParentOwner && !hasPermisstionToEditRestrictedPart));
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableAllocationItem;
    const parentChildRelkey = item.parentDocId ? `alloc-row-${item.parentDocId}-${item?.itemId}` : `alloc-row-${item?.itemId}`;
    item.isDisabled = isDisabled;
    item.isUpgradeDisabled = isUpgradeDisabled;
    item.enabledFieldsForEditing = enabledFieldsForEditing;
    item.inRestrictedEditMode = inRestrictedEditMode;

    const modifiedProps = {
      className: cx(replace(row?.props?.className, 'k-alt', ''), {
        [classes.WhiteBg]: isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.grayBg]: !isEmpty(item[SUB_ITEMS_FIELD]),
      }),
    };

    const showWithoutActions = !item[MODE_FIELD]
      || !item.isEditEnabled
      || (!inRestrictedEditMode && !item.isParentOwner)
      || disableEditInRestrictedEditMode(item);

    if (showWithoutActions) {
      return React.cloneElement(row, {
        ...modifiedProps,
        ['data-cy' as string]: `alloc-row-${item?.itemId}`,
        ['data-parent-rel' as string]: parentChildRelkey,
      });
    }

    const isOwner = item.isOwner;

    const actions = (
      <td className={classes.actionsCell}>
        <ActionsCell
          dataItem={item}
          onConfirm={formik?.submitForm}
          onDiscard={discardAllocItem}
          onDelete={
            isOwner || item.isParentOwner || (item?.childNodes || []).length > 0
              ? removeAllocItem
              : undefined
          }
          onRestore={undefined}
          rootClassName={classes.popperHolder}
        />
      </td>);

    return React.cloneElement(
      row,
      {
        ...modifiedProps,
        ['data-cy' as string]: `alloc-row-${item?.itemId}`,
        ['data-parent-rel' as string]: parentChildRelkey,
        className: cx(row.props.className, classes.updatingRow),
      },
      [row.props.children, actions],
    );
  };

  const getAllItemIds = (items: AllocationItem[]) => {
    if (!items) return [];
    const ids: string[] = [];
    items.forEach((item) => {
      ids.push(item.id);
      if (item[SUB_ITEMS_FIELD] && !isEmpty(item[SUB_ITEMS_FIELD])) {
        ids.push(...getAllItemIds(item[SUB_ITEMS_FIELD] as AllocationItem[]));
      }
    });
    return uniq(ids);
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

  React.useEffect(() => {
    if (isExpandAll) {
      handleExpandAll();
    } else {
      handleCollapseAll();
    }
  }, [isExpandAll]);

  let _export;

  const exportToExcel = () => {
    const ArIdAllowedStatusList = [
      DocumentRevisionStatus.Approved,
      DocumentRevisionStatus.PendingChange,
      DocumentRevisionStatus.InReview,
    ];
    const data = treeToFlat(processData(), EXPAND_FIELD, SUB_ITEMS_FIELD).map(
      (part) => {
        const availableRevisions = part?.availableRevisions;
        const changeReqDetails = availableRevisions?.changeRequestDetails;
        const isReleased = availableRevisions?.isReleased;
        let cellValue;
        if (!availableRevisions) {
          cellValue = CELL_EMPTY_VALUE;
        } else if (isReleased) {
          cellValue = CELL_EMPTY_VALUE;
        } else if (!changeReqDetails) {
          cellValue = availableRevisions?.displayRevision;
        } else {
          cellValue = changeReqDetails?.crId;
        }
        return {
          ...part,
          attachmentsCount: part?.attachmentNames?.length,
          changeRequestDetails: {
            crId: ArIdAllowedStatusList.includes(part?.status)
              ? part?.changeRequestDetails?.crId
              : '',
          },
          hasChanges: cellValue,
        };
      },
    );
    const tableColumns = [...columns];
    const options = _export.workbookOptions(data, tableColumns);

    _export.save(options);
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
        <Grid item>
          <Grid container justify="flex-end">
            <Grid
              item
              data-cy="excel-export"
              className={cx({ [classes.disabled]: isShowOnly })}
            >
              <StyleTooltip
                title={translate('common.download')}
                placement="top"
                arrow
              >
                <FontAwesomeIcon
                  data-cy="excel-download"
                  className={classes.exportExcelIcon}
                  onClick={exportToExcel}
                  icon={solid('arrow-down-to-line')}
                />
              </StyleTooltip>
            </Grid>
            <Grid
              item
              data-cy="show-hide-columns"
              className={cx({ [classes.disabled]: isShowOnly })}
            >
              <ColumnShowHideTreeMenu
                columnDefinition={columns}
                onChange={onColumnShowHide}
              />
            </Grid>
          </Grid>
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
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          columnConfig: JSON.stringify(columns),
        },
        ALLOCATION_TABLE_NAME,
      ),
    );
  };

  const getColumns = () => {
    return columns.filter(({ isHidden }) => !isHidden) ?? [];
  };

  const onColumnReorder = (event: TreeListColumnReorderEvent) => {
    updateColumns(event.columns as CustomTreeListColumnProps[]);
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
    <>
      <Grid item>
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
                <ExcelExport
                  ref={(exporter) => (_export = exporter)}
                  hierarchy
                  fileName={EXCEL_FILE_NAME}
                >
                  <TreeList
                    style={{ overflow: 'auto', height: `${size?.height}px` ?? '100px' }}
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
                    columnMenu={
                      (props) => (
                        <CustomColumnMenu
                          {...props}
                          columns={getColumns()}
                          {...{
                            onLock,
                            onColumnShowHide,
                          }}
                        />
                      )
                    }
                    onRowClick={editAllocationItem}
                    onColumnReorder={onColumnReorder}
                    onFilterChange={onFilterChange}
                    resizable={TREELIST_CONFIG.resizable}
                    reorderable={TREELIST_CONFIG.reorderable}
                    sortable={TREELIST_CONFIG.sortable}
                    toolbar={renderToolbar}
                    cellRender={cellRender}
                    row={TreeListDraggableRow}
                  />
                </ExcelExport>
              </Grid>
              {confirmationDialog.isOpen && (
                <AlertDialog
                  dialog={confirmationDialog}
                  confirmAction={confirmDeletePart}
                  cancelAction={cancelDeletePart}
                  message="bom.item.delete.alert"
                />
              )}
            </Grid>
          </ColumnMenuContext.Provider>
        </FormikProvider>
      </Grid>
      <Grid item>
        {!isDisabled && (
          <AddButton
            fullWidth
            attached
            kind="add"
            className={classes.bottomAddButtom}
            data-cy="fb-control-btn"
            onClick={addAllocationItem}
          >
            {translate('form.builder.add.item')}
          </AddButton>
        )}
      </Grid>
    </>
  );
};

export default React.memo(withThemeNext(React.forwardRef(FBAllocationTreeList)));
