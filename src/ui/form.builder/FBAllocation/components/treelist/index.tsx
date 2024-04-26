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
  TreeListCellProps, TreeListDataStateChangeEvent, TreeListDraggableRow, TreeListFilterChangeEvent, treeToFlat,
} from '@progress/kendo-react-treelist';
import { ScrollMode } from '@progress/kendo-react-treelist/dist/npm/ScrollMode';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import {
  chain, get, isEmpty, isNil, map, replace, uniq,
} from 'lodash';
import { toJS } from 'mobx';
import { useObserver } from 'mobx-react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { FB } from '../../..';
import { SM } from '../../../../../App';
import { translate } from '../../../../../common/intl';
import { getTableCriteria } from '../../../../../common/utils/selectors';
import { allocationActions } from '../../../../../state/ducks/Allocation';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { WO_PART_KEY_NAME } from '../../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { tableSearchActions } from '../../../../../state/ducks/tableSearch';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import Loader from '../../../../components/common/kendo/Loader';
import { ColumnMenuContext, CustomColumnMenu } from '../../../../components/common/treelist/column.templates/CustomColumnMenu';
import ColumnShowHideTreeMenu from '../../../../components/common/treelist/ColumnShowHideTreeMenu';
import ExportTreeListDialog from '../../../../components/common/treelist/ExportTreeListDialog/ExportTreeListDialog';
import { CustomTreeListColumnProps } from '../../../../components/common/treelist/types';
import { Button as AddButton } from '../../../../components/forms/fields-next';
import { toastError } from '../../../../components/notifications';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';
import { toFixed } from '../../../../dashboard.new/line.items/common/Utils';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import { withThemeNext } from '../../../../layout/theme-next';
import { AllocationItem, AllocationItemEditEvent, EditableAllocationItem } from '../../interface';
import AutoOptions from './AutoOptions';
import {
  ADD_FIELD,
  ALLOCATION_TABLE_NAME,
  AllocationCheckBoxOptions,
  CELL_EMPTY_VALUE, DATA_ITEM_KEY,
  DOC_ID_FIELD,
  EXCEL_FILE_NAME,
  EXPAND_FIELD,
  ID_FIELD,
  MAX_DECIMALS,
  MODE_FIELD, SUB_ITEMS_FIELD,
  TREELIST_CONFIG,
} from './constants';
import {
  AllocationState,
  CustomTreeListExpandChangeEvent,
  CustomTreeListRowProps,
  FBAllocationProps,
} from './interface';
import { TreeListSchema } from './schema';
import useStyles from './styles';
import { processAllocationData } from './utils';

const FBAllocationTreeList: React.FC<FBAllocationProps> = ({
  documentRevision,
  isDisabled,
  isShowOnly = false,
}) => {
  const { _tabsState } = SM.useStores();
  const { useEffect, useRef, useState } = React;
  const dispatch = useDispatch();
  const treeListRef = useRef(null);
  const size = useObserver(() => _tabsState?.contentSize);
  const { _documentRevisionFormState } = SM.useStores();
  const { workspaceState } = FB.useStores();
  const isDocument = !isEmpty(documentRevision?.formTemplate);
  const partRevIdSelected: string = isDisabled
    ? documentRevision?.formInput?.[WO_PART_KEY_NAME]?.id
    : workspaceState?.formInputSync?.get(WO_PART_KEY_NAME)?.id ?? '';

  const classes = useStyles({ size });

  const treeListAsync = useAsync({
    onSuccess: (response?: AllocationItem[]) => {
      updateState({
        ...state,
        data: [...(processAllocationData(response))],
      });
      selectedPart && discardAllocItem(selectedPart);
      setSelectedPart(undefined);
    },
    onError: toastError,
  });

  const reloadAllocationList = () => {
    treeListAsync.start(
      fetchAllocationTreeList,
      documentRevision.id,
      treeListAsync,
    );
    dispatch(documentRevisionsActions.loadAudit(documentRevision.id));
  };

  const partAsync = useAsync({
    onSuccess: reloadAllocationList,
    onError: toastError,
  });

  const deleteLotAsync = useAsync({
    onSuccess: () => {
      setSelectedPart(undefined);
      reloadAllocationList();
    },
    onError: toastError,
  });
  const alertDialog = useDialog();

  const fetchAllocationTreeList = useActionCreator(
    allocationActions.loadAllocationList,
  );

  const autoAssignLOT = useActionCreator(
    allocationActions.autoAssignLOT,
  );

  const createPart = useActionCreator(
    allocationActions.addPart,
  );

  const createLot = useActionCreator(
    allocationActions.addLot,
  );

  const updatePart = useActionCreator(
    allocationActions.updatePart,
  );

  const deletePart = useActionCreator(
    allocationActions.deletePart,
  );

  const deleteLot = useActionCreator(
    allocationActions.deleteLot,
  );

  const onDeleteLot = (dataItem) => {
    alertDialog.open();
    setSelectedPart(dataItem);
  };

  const onConfirmDelete = () => {
    if (selectedPart) {
      deleteLotAsync.start(
        deleteLot,
        documentRevision.id,
      selectedPart?.parentPartRevId,
      selectedPart?.lotRevId,
      deleteLotAsync,
      );
      alertDialog.close();
    }
  };

  const [state, setState] = React.useState<AllocationState>({
    data: [],
    dataState: {
      sort: [],
      filter: [],
    },
    expanded: [],
    inEdit: [],
  });

  const handleAutoAssignLot = (isAutoAssign) => {
    if (partRevIdSelected && isAutoAssign) {
      treeListAsync.start(
        autoAssignLOT,
        documentRevision.id,
        treeListAsync,
      );
      handleExpandAll();
    }
  };

  useEffect(() => {
    if (documentRevision?.id && partRevIdSelected) {
      reloadAllocationList();
    }

    return () => {
      _documentRevisionFormState?.setAllocationInfo(undefined);
    };
  }, [documentRevision?.id]);

  const createOrUpdateLOT = (values: Partial<EditableAllocationItem>) => {
    if (values[ADD_FIELD]) {
      const payload = {
        workOrderId: documentRevision?.id,
        lotRevId: values.lotRevId,
        partRevId: values.parentPartRevId,
        lotQuantityNeeded: values.quantityNeeded,
        lotVariance: values.variance,
      };

      partAsync.start(createLot, payload, partAsync);
    } else {
      const payload = {
        lotQuantityNeeded: values.quantityNeeded,
        lotVariance: values.variance,
        lotRevId: values.lotRevId,
      };

      partAsync.start(updatePart, documentRevision?.id,
        values.parentPartRevId,
        false,
        payload, partAsync);
    }
  };

  const createOrUpdatePart = (values: Partial<EditableAllocationItem>) => {
    const partVariance = values.variance || undefined;
    if (values[ADD_FIELD]) {
      const payload = {
        workOrderId: documentRevision?.id,
        workOrderPartRevId: partRevIdSelected,
        partRevId: values.partRevId,
        partQuantityNeeded: values.quantityNeeded,
        partVariance,
      };

      partAsync.start(createPart, payload, partAsync);
    } else {
      const payload = {
        partQuantityNeeded: values.quantityNeeded,
        partVariance,
      };

      partAsync.start(updatePart, documentRevision?.id, get(values.partRevId, 'value'),
        workspaceState?.formInputSync?.get(AllocationCheckBoxOptions.AUTO_ASSIGN),
        payload, partAsync);
    }
  };

  const formik = useFormik<Partial<EditableAllocationItem>>({
    initialValues: {},
    onSubmit: (values) => {
      if (values.lotRevId) {
        createOrUpdateLOT(values);
      } else {
        createOrUpdatePart(values);
      }
    },
  });

  const updateState = (stateInfo) => {
    _documentRevisionFormState?.setAllocationInfo(stateInfo);
    setState(stateInfo);
  };

  const createNewLotItem = () => {
    return {
      id: uuidv4(),
      lotDocId: '',
      docId: '',
      variance: '',
      issuedQty: '',
      itemId: '',
      isNewAddition: true,
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
      isLotAddition: true,
    };
  };

  const addLot = (dataItem: EditableAllocationItem) => {
      _documentRevisionFormState?.setDirty(true);
      const state = toJS(_documentRevisionFormState?.getAllocationInfo) as unknown as AllocationState;
      const index = state?.data?.findIndex(data => { return data.id === dataItem.id; });
      state.data = ignorePreviouslyAddedItems(state.data);

      if (state.data.length && index !== -1) {
        const newAllocItem: EditableAllocationItem = createNewLotItem();
        newAllocItem.parentPartRevId = dataItem.partRevId;
        state.data[index][SUB_ITEMS_FIELD] = state.data[index][SUB_ITEMS_FIELD]?.filter(
          (data) => !data[ADD_FIELD],
        );

      state.data[index][SUB_ITEMS_FIELD]?.unshift(newAllocItem);

      updateState({
        ...state,
        data: [...state.data],
        expanded: [state.data[index].id],
        inEdit: [newAllocItem],
      });
      }
  };

  const discardAllocItem = (dataItem?: EditableAllocationItem) => {
    const state = toJS(_documentRevisionFormState?.getAllocationInfo) as unknown as AllocationState;

    if (dataItem?.[ADD_FIELD]) {
      if (dataItem.parentPartRevId) {
        const parentIndex = state?.data?.findIndex(data => { return data.partRevId === dataItem.parentPartRevId; });
        if (parentIndex !== -1) {
          state.data[parentIndex][SUB_ITEMS_FIELD] = state.data[parentIndex][SUB_ITEMS_FIELD]?.filter(
            (data) => !data[ADD_FIELD],
          );
        }
      } else {
        state.data = state.data?.filter(
          (data) => !data[ADD_FIELD],
        );
      }
    }

    _documentRevisionFormState?.setDirty(false);
    updateState({
      ...state,
      inEdit: [],
    });

    formik?.resetForm();
  };

  const removeAllocItem = (dataItem: EditableAllocationItem) => {
    if (dataItem.isDisabled || isDocument) {
      return;
    }
    confirmationDialog.open();
    setSelectedPart(dataItem);
  };

  const schema: CustomTreeListColumnProps[] = TreeListSchema({
    addLot,
    actionsClass: classes.actionsCell,
    popperHolder: classes.popperHolder,
    onConfirm: formik.submitForm,
    onDiscard: discardAllocItem,
    onDelete: removeAllocItem,
    onDeleteLot,
  });

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
      updateState({ ...state, dataState: tableCriteria.queryDict.dataState });
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
    deleteLotAsync.start(
      deletePart,
      documentRevision.id,
      selectedPart?.partRevId,
      deleteLotAsync,
    );
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
    if (!dataState) {
      state.dataState = {
        sort: [],
        filter: [],
      };
      return [];
    }
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
      && orderBy(filteredData, dataState?.sort, SUB_ITEMS_FIELD);
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

  const createPartItem = () => {
    return {
      id: uuidv4(),
      lotDocId: '',
      variance: '',
      issuedQty: '',
      docId: '',
      itemId: '',
      isNewAddition: true,
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
    };
  };

  const ignorePreviouslyAddedItems = (data: AllocationItem[]) => {
    return data?.filter((data) => {
      const isAlocationItemAddExist = !data[ADD_FIELD];
      if (data[SUB_ITEMS_FIELD]) {
        data[SUB_ITEMS_FIELD] = data[SUB_ITEMS_FIELD]?.filter((lot) => !lot[ADD_FIELD]);
      }
      return isAlocationItemAddExist;
    });
  };

  const addAllocationItem = () => {
    if (!partRevIdSelected) {
      toastError(translate('allocation.part.selection.error'));
      return;
    }
    _documentRevisionFormState?.setDirty(true);
    const newAllocItem = createPartItem();
    const isAddAllocationItemExists = state.data?.findIndex((data) => data[ADD_FIELD]);
    if (isAddAllocationItemExists === -1) {
      state.data = ignorePreviouslyAddedItems(state.data);
      state.data.push(newAllocItem);
      updateState({
        ...state,
        data: [...state.data],
        expanded: [state.data[0].id],
        inEdit: [newAllocItem],
      });
    }
  };

  const editAllocationItem = ({ dataItem, level }: AllocationItemEditEvent) => {
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
    setSelectedPart(editItemInfo);
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableAllocationItem;
    const parentChildRelkey = item.parentPartRevId ? `alloc-row-${item?.lotDocId}` : `alloc-row-${item.partRevId}-${item?.docId}`;
    item.isDisabled = isDisabled || isDocument;
    item.woStatus = documentRevision.status;

    const modifiedProps = {
      className: cx(replace(row?.props?.className, 'k-alt', ''), {
        [classes.WhiteBg]: isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.grayBg]: !isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.errorBg]: item.isUnfulfiled,
      }),
    };

    const showWithoutActions = !item[MODE_FIELD];

    if (showWithoutActions) {
      return React.cloneElement(row, {
        ...modifiedProps,
        ['data-cy' as string]: `alloc-row-${item?.itemId}`,
        ['data-parent-rel' as string]: parentChildRelkey,
      });
    }

    return React.cloneElement(
      row,
      {
        ...modifiedProps,
        ['data-cy' as string]: `alloc-row-${item?.itemId}`,
        ['data-parent-rel' as string]: parentChildRelkey,
        className: cx(row.props.className, classes.updatingRow),
      },
    );
  };

  const getAllItemIds = (items: AllocationItem[]) => {
    if (!items) return [];
    const ids: string[] = [];
    items.forEach((item) => {
      ids.push(item.id);
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

  let _export;

  const exportTreelistDialog = useDialog();
  const [exportFileName, setExportFileName] = useState(EXCEL_FILE_NAME);

  const confirmExportTreelistDialog = (fileName) => {
    exportTreelistDialog.close();
    setExportFileName(fileName || EXCEL_FILE_NAME);
    exportToExcel();
  };

  const getFieldValue = (value) => {
    return isNil(value) ? CELL_EMPTY_VALUE : toFixed(value, MAX_DECIMALS);
  };

  const exportToExcel = () => {
    const exportData = processData().map((data) => {
      data[EXPAND_FIELD] = true;
      return data;
    });

    const data = treeToFlat(exportData, EXPAND_FIELD, SUB_ITEMS_FIELD).map(
      (part: EditableAllocationItem) => {
        const isLotRecord = Boolean(part.isLotAddition || part.lotRevId);
        const isPartRecord = !isLotRecord;
        const quantityNeeded = getFieldValue(part.quantityNeeded);
        let qtyOnHandAfter = isPartRecord ? CELL_EMPTY_VALUE : (part.quantityOnHand ?? 0) - (part.quantityNeeded ?? 0);
        let quantityOnHand = isPartRecord ? CELL_EMPTY_VALUE : getFieldValue(part.quantityOnHand);
        const variance = isLotRecord ? CELL_EMPTY_VALUE : getFieldValue(part.variance);
        const issuedQty = isLotRecord ? CELL_EMPTY_VALUE : getFieldValue((part.variance ?? 0) + part.quantityNeeded);

        if (documentRevision.status !== DocumentRevisionStatus.Draft && !isPartRecord) {
          quantityOnHand = getFieldValue(part.quantityBeforeKitting);
          qtyOnHandAfter = getFieldValue(part.quantityAfterKitting);
        }

        return {
          ...part,
          quantityOnHand,
          quantityNeeded,
          variance,
          issuedQty,
          partRevId: part.docId,
          qtyOnHandAfter,
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
                  onClick={() => exportTreelistDialog.open()}
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
                columnDefinition={columns.filter(item => item.id !== 'actions')}
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
  const isLoading = treeListAsync.isLoading || partAsync.isLoading || deleteLotAsync.isLoading;

  return (
    <>
      <AutoOptions documentRevision={documentRevision} onAutoAssign={handleAutoAssignLot} isDisabled={isDisabled || isDocument} />
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
                  fileName={exportFileName}
                >
                  <TreeList
                    style={{
                      overflow: 'auto',
                      height: `${size?.height}px` ?? '100px',
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
                </ExcelExport>
                {isLoading && <Loader />}
              </Grid>
              {exportTreelistDialog.isOpen && (
                <ExportTreeListDialog
                  confirmDialog={confirmExportTreelistDialog}
                  dialog={exportTreelistDialog}
                />
              )}
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
        {!isDisabled && !isDocument && (
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
      <AlertDialog
        confirmAction={onConfirmDelete}
        cancelAction={alertDialog.close}
        confirmLabel="common.yes.proceed"
        cancelLabel="common.cancel"
        message="allocation.lot.delete.confirmation"
        dialog={alertDialog}
      />
    </>
  );
};

export default React.memo(withThemeNext(React.forwardRef(FBAllocationTreeList)));
