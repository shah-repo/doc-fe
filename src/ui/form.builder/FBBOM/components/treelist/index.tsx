import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid } from '@material-ui/core';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { GridToolbar } from '@progress/kendo-react-grid';
import {
  extendDataItem,
  filterBy,
  mapTree,
  orderBy,
  TreeList, TreeListCellProps,
  TreeListColumnReorderEvent,
  TreeListDataStateChangeEvent,
  TreeListDraggableRow,
  TreeListRowDragEvent, treeToFlat,
} from '@progress/kendo-react-treelist';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import {
  chain, get, has, isEmpty,
  map,
  omit,
  replace,
  tail,
  take,
  uniq,
} from 'lodash';
import { toJS } from 'mobx';
import { useObserver } from 'mobx-react';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SM } from '../../../../../App';
import { translate } from '../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import Loader from '../../../../components/common/kendo/Loader';
import { Button as AddButton } from '../../../../components/forms/fields-next';
import { toastError } from '../../../../components/notifications';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import { Colors, withThemeNext } from '../../../../layout/theme-next';
import { BOM, BOMEditEvent, EditableBOM } from '../../interface';
import { ActionsCell } from './column.templates/Actions';
import { CustomColumnMenu } from './column.templates/CustomColumnMenu';
import ColumnShowHideTreeMenu from './common/ColumnShowHideTreeMenu';
import {
  ADD_FIELD,
  DATA_ITEM_KEY,
  EXCEL_FILE_NAME,
  EXPAND_FIELD, MODE_FIELD, SELECTED_PART_KEY_SEPARATOR,
  SUB_ITEMS_FIELD,
  TREELIST_CONFIG,
} from './constants';
import {
  BOMState,
  CustomTreeListExpandChangeEvent,
  CustomTreeListRowProps,
  FBBOMProps,
  CustomTreeListColumnProps,
} from './interface';
import useStyles from './styles';
import { getExcelColumns, getHyperLinkForArIdCell, getHyperLinkForIdCell, isOfSameParent, processBOMData, updateDataAtLevels } from './utils';
import WhereUsedDialog from './WhereUsedDialog';
import { TreeColumns } from './schema';

const FBBOMTreeList: React.FC<FBBOMProps> = ({ documentRevision, isDisabled, isShowedBOMDiff = false }) => {
  const classes = useStyles();
  const [state, setState] = React.useState<BOMState>({
    data: [],
    dataState: {
      sort: [],
      filter: [],
    },
    expanded: [],
    inEdit: [],
  });
  const { _documentRevisionFormState } = SM.useStores();
  const [selectedPartLevel, setSelectedPartLevel] = React.useState<{level: number[], dataItem: EditableBOM}>();
  const treeListRef = useRef(null);

  const [showTree, setShowTree] = useState(false);

  const treeListAsync = useAsync({
    onSuccess: ({
      bomTreeRelations,
      parentRevDetails,
    }: {
      bomTreeRelations: BOM[]
      parentRevDetails: BOM
    }) => {
      formik.setValues({});
      const bomProccessedData = processBOMData(
        bomTreeRelations,
        parentRevDetails,
      );
      _documentRevisionFormState?.setIsBOMExists(bomTreeRelations.length > 0);
      updateState({
        ...state,
        data: [...bomProccessedData],
        inEdit: [],
        expanded: [...state.expanded, ...[bomProccessedData[0].id]],
      });
    },
    onError: (err) => {
      toastError(err);
    },
  });

  const updateState = (stateInfo) => {
    _documentRevisionFormState?.setBOMInfo(stateInfo);
    setState(stateInfo);
  };

  const partAsync = useAsync({
    onSuccess: () => {
      treeListAsync.start(
        fetchBOMTreeList,
        documentRevision.id,
        documentRevision.documentId,
        treeListAsync,
      );
    },
    onError: (response) => {
      toastError(response);
    },
  });

  const partChangeOrderAsync = useAsync({
    onError: (response) => {
      toastError(response);
    },
  });

  useEffect(() => {
    if (!documentRevision) {
      return;
    }
    treeListAsync.start(
      fetchBOMTreeList,
      documentRevision.id,
      documentRevision.documentId,
      treeListAsync,
    );
  }, [documentRevision?.id]);

  const fetchBOMTreeList = useActionCreator(
    documentRevisionsActions.fetchBOMTree,
  );
  const deleteBOMBranch = useActionCreator(
    documentRevisionsActions.deleteBOMBranch,
  );
  const addBOMBranch = useActionCreator(documentRevisionsActions.addBOMBranch);
  const updateBOMBranch = useActionCreator(
    documentRevisionsActions.updateBOMBranch,
  );
  const reorderBOMBranch = useActionCreator(
    documentRevisionsActions.changeOrderBOMBranch,
  );

  SM.reaction(
    () => _documentRevisionFormState?.refreshBOMTree,
    (loading) => {
      if (loading && documentRevision) {
        treeListAsync.start(
          fetchBOMTreeList,
          documentRevision.id,
          documentRevision.documentId,
          treeListAsync,
        );
      }
    });

  const [columns, setColumns]
    = React.useState<CustomTreeListColumnProps[]>(TreeColumns);

  const onExpandChange = (event: CustomTreeListExpandChangeEvent) => {
    const expanded = event.value
      ? state.expanded.filter((id) => id !== event.dataItem.id)
      : [...state.expanded, event.dataItem.id];
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

  const whereUsedDialog = useDialog();
  const openWhereUsedDialog = () => {
    whereUsedDialog.open();
  };
  const closeWhereUsedDialog = () => {
    whereUsedDialog.close();
  };

  const fetchHasATreeAction = useActionCreator(documentRevisionsActions.fetchHasATree);
  const fetchHasATreeAsync = useAsync({
    onSuccess: (statusObj: BOM) => {
      if (statusObj && statusObj[documentRevision?.id]) {
        setShowTree(true);
      }
    },
  });
  const fetchHasATree = (docRevId) => {
    fetchHasATreeAsync.start(fetchHasATreeAction, [docRevId], fetchHasATreeAsync);
  };

  useEffect(() => {
    fetchHasATree(documentRevision?.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentRevision?.id]);

  const [selectedPart, setSelectedPart] = useState<EditableBOM>();
  const confirmDeletePart = (e: React.MouseEvent<HTMLElement>) => {
    const partInfo = selectedPart?.id?.split(SELECTED_PART_KEY_SEPARATOR) ?? [];
    partAsync.start(
      deleteBOMBranch,
      partInfo[1],
      partInfo[0],
      partAsync,
    );
    discardBOM(selectedPart);
    confirmationDialog.close();
  };

  const cancelDeletePart = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    confirmationDialog.close();
  };

  const addExpandField = (dataTree: BOM[]) => {
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
    const filteredData
      = dataState.filter && filterBy(data, dataState.filter, SUB_ITEMS_FIELD);
    const sortedData
      = dataState.sort
      && filteredData
      && orderBy(filteredData, dataState.sort, SUB_ITEMS_FIELD);
    return addExpandField(sortedData as BOM[]);
  };

  const onColumnShowHide = ({ field }: CustomTreeListColumnProps) => {
    const dataColumns = map(columns, (column: CustomTreeListColumnProps) => {
      if (column.field === field) {
        column.hidden = !column.hidden;
      }
      return column;
    });
    setColumns(dataColumns);
  };

  const formik = useFormik<Partial<EditableBOM>>({
    initialValues: {},
    onSubmit: (values) => {
      const partInfo = omit(values, [MODE_FIELD, 'dataItem']);
      partInfo.unit = get(partInfo, 'unit.value');
      if (values[ADD_FIELD]) {
        if (!partInfo.parentNodeRevId) {
          partInfo.parentNodeRevId = documentRevision.id;
        }
        if (!partInfo.parentNodeDocumentId) {
          partInfo.parentNodeDocumentId = documentRevision.documentId;
        }
        partInfo.isMarkedAsDeleted = false;
        partAsync.start(addBOMBranch, partInfo, partAsync);
      } else {
        const payload = {
          childNodeRevId: partInfo.childNodeRevId,
          refDesignator: partInfo.refDesignator,
          quantity: partInfo?.quantity ? +partInfo?.quantity ?? 0 : 0,
          unit: partInfo.unit,
          comment: partInfo.comment,
          newChildNodeRevId: partInfo.newChildNodeRevId,
        };
        partAsync.start(
          updateBOMBranch,
          partInfo.parentNodeRevId,
          partInfo.childNodeRevId,
          payload,
          partAsync,
        );
      }
    },
  });

  const createNewItem = () => {
    return {
      id: uuidv4(),
      revision: '',
      status: '',
      name: '',
      docId: '',
      cost: '',
      quantity: '',
      leadTime: '',
      unit: '',
      comment: '',
      refDesignator: '',
      attachmentNames: [],
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
    };
  };

  const isNewBOMAdditionInProgress = () => {
    return (state.inEdit.length > 0);
  };
  const addBOM = () => {
    if (isNewBOMAdditionInProgress()) {
      return;
    }
    const newBOM: EditableBOM = createNewItem();
    state.data[0][SUB_ITEMS_FIELD] = state.data[0][SUB_ITEMS_FIELD]?.filter(
      (data) => !data[ADD_FIELD],
    );
    state.data[0][SUB_ITEMS_FIELD]?.push(newBOM);
    updateState({
      ...state,
      data: [...state.data],
      expanded: [state.data[0].id],
      inEdit: [newBOM],
    });
  };

  const editBOM = ({ dataItem, level }: BOMEditEvent) => {
    if (dataItem.id === documentRevision.id || dataItem.inEdit || isDisabled || dataItem.isMarkedAsDeleted) {
      // skipping edit for parent and click on edit item itself
      return;
    }
    setSelectedPartLevel({ dataItem, level });
    if (isNewBOMAdditionInProgress() && !dataItem[ADD_FIELD]) {
      state.data = updateDataAtLevels([...state.data], selectedPartLevel?.level, dataItem, false) as BOM[];
    }
    const editBOMInfo = extendDataItem(dataItem, SUB_ITEMS_FIELD);
    const childRevId = editBOMInfo.id.split(SELECTED_PART_KEY_SEPARATOR)[0];
    editBOMInfo.customDocId = `${childRevId}${SELECTED_PART_KEY_SEPARATOR}${editBOMInfo.documentId}`;
    editBOMInfo.childNodeRevId = childRevId;
    formik?.setFieldValue('revision', editBOMInfo?.revision);
    updateState({
      ...state,
      data: [...state.data],
      inEdit: [editBOMInfo],
    });
    formik.setValues(editBOMInfo);
  };

  const discardBOM = (dataItem?) => {
    if (dataItem && dataItem[ADD_FIELD]) {
      if (selectedPartLevel?.level) {
        const updatedData = updateDataAtLevels([...state.data], selectedPartLevel?.level, dataItem, false) as BOM[];
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
    updateState({
      ...state,
      inEdit: [],
    });

    formik?.resetForm();
  };

  const removeBOM = (dataItem) => {
    confirmationDialog.open();
    setSelectedPart(dataItem);
  };

  const onRestore = (dataItem) => {
    const partInfo = dataItem.id?.split(SELECTED_PART_KEY_SEPARATOR);
    const payload = {
      childNodeRevId: partInfo[0],
      isMarkedAsDeleted: false,
    };
    partAsync.start(
      updateBOMBranch,
      partInfo[1],
      partInfo[0],
      payload,
      partAsync,
    );
  };

  const onReorder = () => {
    // TODO
  };

  const onChildPartAdd = (dataItem: EditableBOM, updatedState?: BOMState) => {
    if (isDisabled) {
      return;
    }
    const newBOM: EditableBOM = createNewItem();
    newBOM.parentNodeDocumentId = dataItem.documentId;
    newBOM.parentNodeRevId = dataItem.id.split(SELECTED_PART_KEY_SEPARATOR)[0];
    const updatedBOMState = _documentRevisionFormState?.getBOMInfo ? toJS(_documentRevisionFormState?.getBOMInfo) : undefined;
    const level = updatedState ? toJS(_documentRevisionFormState?.getChildPartInfo?.level) : selectedPartLevel?.level;
    const stateData = updatedState ? updatedBOMState?.data : state.data;
    if (stateData) {
      const updatedData = updateDataAtLevels([...stateData], level, newBOM, true) as BOM[];
      const expanded = updatedState ? updatedState.expanded : state.expanded;
      updateState({
        ...state,
        data: [...updatedData],
        expanded: [...expanded, dataItem.id],
        inEdit: [newBOM],
      });
      formik.setValues(newBOM);
      const treeList: HTMLElement = treeListRef.current;
      if (!treeList && !dataItem) return;
      setTimeout(() => {
        const id = dataItem[SUB_ITEMS_FIELD]?.length
          ? dataItem[SUB_ITEMS_FIELD][dataItem[SUB_ITEMS_FIELD]?.length - 1].id
          : dataItem.id;
        const rowElement = treeList?.querySelector(`[id^="_${id}"]`);
        if (rowElement) {
          rowElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  };

  useObserver(() => {
    isShowedBOMDiff = Boolean(_documentRevisionFormState?.isShowedBOMDiff);
  });

  const showHideDiff = () => {
    _documentRevisionFormState?.toggleIsShowedBOMDiff();
    handleExpandAll();
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableBOM;
    item.isDisabled = isDisabled;

    if (isEmpty(item.refDesignator)) {
      item.refDesignator = '-';
    }
    const modifiedProps = {
      className: cx(replace(row?.props?.className, 'k-alt', ''), {
        [classes.WhiteBg]: isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.grayBg]: !isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.deletedBg]: item.isMarkedAsDeleted || (isShowedBOMDiff && item.replacesStatus),
      }),
    };
    if (!item[MODE_FIELD]) {
      return React.cloneElement(row, modifiedProps);
    }
    const isOwner = item.isOwner;

    const actions = (
      <td className={classes.actionsCell}>
        <ActionsCell
          dataItem={item}
          onConfirm={formik?.submitForm}
          onDiscard={discardBOM}
          onDelete={(isOwner || item.isParentOwner || (item?.childNodes || []).length > 0) ? removeBOM : undefined}
          onRestore={onRestore}
          onReorder={onReorder}
          isAddPartEnabled={isOwner}
          onChildPartAdd={onChildPartAdd}
          rootClassName={classes.popperHolder}
        />
      </td>
    );

    return React.cloneElement(
      row,
      {
        ...modifiedProps,
        className: cx(row.props.className, classes.updatingRow),
      },
      [row.props.children, actions],
    );
  };

  const getAllItemIds = (items: BOM[]) => {
    if (!items) return [];
    const ids: string[] = [];
    items.forEach((item) => {
      ids.push(item.id);
      if (
        item[SUB_ITEMS_FIELD]
        && (item?.depth || 0) < 2
        && !isEmpty(item[SUB_ITEMS_FIELD])
      ) {
        ids.push(...getAllItemIds(item[SUB_ITEMS_FIELD] as BOM[]));
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

  let _export;

  const exportToExcel = () => {
    const data = treeToFlat(processData(), EXPAND_FIELD, SUB_ITEMS_FIELD)
      .map(part => ({
        ...part,
        attachmentsCount: part?.attachmentNames?.length,
        vendorsCount: part?.vendors?.length,
      }));
    const tableColumns = getExcelColumns(columns);

    const dataMap = data.reduce((acc, val) => {
      acc.docIdMap[val?.docId] = val;
    val?.changeRequestDetails && (acc.arIdMap[val?.changeRequestDetails?.crId] = val?.changeRequestDetails);
    return acc;
    }, { docIdMap: {}, arIdMap: {} });

    const { docIdMap, arIdMap } = dataMap;
    const options = _export.workbookOptions(data, tableColumns);

    const rows = options?.sheets[0]?.rows;
    rows.forEach((row) => {
      if (row.type === 'data') {
        row.cells.forEach((cell) => {
          if (has(docIdMap, cell?.value)) {
            cell.color = Colors.primaryDark;
            cell.formula = getHyperLinkForIdCell(docIdMap[cell?.value], cell?.value);
          }
          if (has(arIdMap, cell?.value)) {
            cell.color = Colors.primaryDark;
            cell.formula = getHyperLinkForArIdCell(arIdMap[cell?.value]?.id, cell.value);
          }
        });
      }
    });
    _export.save(options);
  };

  const renderToolbar = (
    <GridToolbar>
      <Grid container justify="space-between">
        <Grid
          item
          data-cy="collapse-expand-collapse"
          className={classes.toggleExpandCollapse}
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
            <Grid item
              data-cy="show-hide-diff"
              className={classes.diffContainer}
            >
              <span className={classes.toggleIconContainer} onClick={showHideDiff}>
                {isShowedBOMDiff
                  ? <FontAwesomeIcon className={classes.toggleIcon} icon={regular('toggle-large-on')} size="lg" />
                  : <FontAwesomeIcon style={{ cursor: 'pointer' }} icon={regular('toggle-large-off')} size="lg" />}
                <span className={classes.toggleIconLabel}>{translate(isShowedBOMDiff ? 'bom.hide.diff' : 'bom.show.diff')}</span>
              </span>
            </Grid>
            <Grid item
              data-cy="excel-export"
            >
              <StyleTooltip
                title={translate('common.download')}
                placement="top"
                arrow
              >
                <FontAwesomeIcon className={classes.exportExcelIcon} onClick={exportToExcel} icon={solid('arrow-down-to-line')} />
              </StyleTooltip>
            </Grid>
            { showTree && <Grid item
              data-cy="where-used-view"
            >
              <StyleTooltip
                title={translate('bom.whereUsed.dialog.title')}
                placement="top"
                arrow
              >
                <FontAwesomeIcon className={classes.viewIcon} icon={solid('tree-deciduous')}
                  onClick={openWhereUsedDialog}
                />
              </StyleTooltip>
            </Grid>}
            <Grid item data-cy="show-hide-columns">
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

  const getColumns = () => {
    return columns.filter(({ hidden }) => !hidden);
  };

  const onColumnReorder = (event: TreeListColumnReorderEvent) => {
    setColumns(event.columns as CustomTreeListColumnProps[]);
  };

  const onLock = React.useCallback(
    ({
      field,
      locked,
      closeMenu,
    }: CustomTreeListColumnProps & { closeMenu: () => void }) => {
      const index = columns.findIndex((c) => c.field === field);
      const column = columns[index];
      if (column) {
        const newColumns = [...columns];
        newColumns.splice(index, 1, { ...column, locked: !locked });
        setColumns(newColumns);
        closeMenu?.();
      }
    },
    [columns],
  );

  const { _tabsState } = SM.useStores();
  const size = useObserver(() => _tabsState?.contentSize);

  const onRowDrop = (event: TreeListRowDragEvent) => {
    if (
      event?.draggedOver
      && isOfSameParent(event?.dragged, event?.draggedOver)
    ) {
      const parentIndices: number[] = event.dragged.slice(0, -1);
      const draggedChildIndex: number = event.dragged.slice(-1)[0];
      const draggedOverChildIndex: number = event.draggedOver?.slice(-1)[0];
      const swapChildElements = (tree: BOM[], parentIndices: number[]) => {
        if (!isEmpty(parentIndices)) {
          const index = take(parentIndices)[0];
          tree[index][SUB_ITEMS_FIELD] = swapChildElements(
            tree[index][SUB_ITEMS_FIELD] as BOM[],
            tail(parentIndices),
          );
        } else {
          const draggedChild = tree.splice(draggedChildIndex, 1)[0];
          tree.splice(draggedOverChildIndex, 0, draggedChild);
          // Update part orders
          partChangeOrderAsync.start(
            reorderBOMBranch,
            draggedChild.parentNodeRevId,
            {
              childNodeRevId: draggedChild.id.split(SELECTED_PART_KEY_SEPARATOR)[0],
              newPos: draggedOverChildIndex,
            },
            partChangeOrderAsync,
          );
        }
        return tree;
      };
      const updatedBOMTree = swapChildElements(state.data, parentIndices);
      updateState({
        ...state,
        data: [...updatedBOMTree],
      });
    } else {
      toastError(translate('bom.order.error.message'));
    }
  };

  const orderByLockedState = (
    columnDefinitions: CustomTreeListColumnProps[],
  ): CustomTreeListColumnProps[] => {
    return chain([...columnDefinitions])
      .orderBy(['locked'], ['desc'])
      .map((column, index) => {
        column.reorderable = !column.locked;
        column.orderIndex = column.locked ? 0 : column.mainOrderIndex;
        return column;
      })
      .value();
  };

  SM.reaction(
    () => _documentRevisionFormState?.childPartInfo,
    (info) => {
      if (info?.dataItem) {
        const dataItem = toJS(info?.dataItem) as EditableBOM;
        const level = toJS(info?.level);
        setSelectedPartLevel({ dataItem, level });
        onChildPartAdd(dataItem, toJS(_documentRevisionFormState?.getBOMInfo));
      }
    },
  );

  SM.reaction(
    () => _documentRevisionFormState?.getRestorePartInfo,
    (info) => {
      if (info?.dataItem) {
        const dataItem = toJS(info?.dataItem) as EditableBOM;
        const level = toJS(info?.level);
        setSelectedPartLevel({ dataItem, level });
        onRestore(dataItem);
      }
    },
  );

  const sortedColumnDefinitions = orderByLockedState(getColumns());

  return (
    <>
      <Grid item className={classes.tableContainer}>
        <FormikProvider value={formik}>
          <Grid container>
            <Grid item xs={12} ref={treeListRef}>
              <ExcelExport ref={(exporter) => (_export = exporter)} hierarchy={true} fileName={EXCEL_FILE_NAME}>
                <TreeList
                  {...state.dataState}
                  style={{
                    width: '100%',
                    maxHeight: size ? size?.height - 160 : 'auto',
                    overflow: 'auto',
                  }}
                  tableProps={{ style: { width: '2561px' } }}
                  editField={MODE_FIELD}
                  expandField={EXPAND_FIELD}
                  dataItemKey={DATA_ITEM_KEY}
                  subItemsField={SUB_ITEMS_FIELD}
                  className="containing-box-scrollbar"
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
                  onRowClick={editBOM}
                  onColumnReorder={onColumnReorder}
                  resizable={TREELIST_CONFIG.resizable}
                  reorderable={TREELIST_CONFIG.reorderable}
                  sortable={TREELIST_CONFIG.sortable}
                  toolbar={renderToolbar}
                  cellRender={cellRender}
                  onRowDrop={onRowDrop}
                  row={TreeListDraggableRow}
                />
              </ExcelExport>
              {(treeListAsync.isLoading || partAsync.isLoading || partChangeOrderAsync.isLoading) && <Loader />}
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
        </FormikProvider>
      </Grid>
      <Grid item>
        {!isDisabled && <AddButton
          fullWidth
          attached
          kind="add"
          className={classes.bottomAddButtom}
          data-cy="fb-control-btn"
          onClick={addBOM}
        >
          {translate('form.builder.add.item')}
        </AddButton>}
      </Grid>
      {
        whereUsedDialog.isOpen
        && <WhereUsedDialog
          docRevId={documentRevision.id}
          whereUsedDialog={whereUsedDialog}
          closeDialog = {closeWhereUsedDialog}
        />
      }
    </>
  );
};

// ts-unused-exports:disable-next-line
export default withThemeNext(React.forwardRef(FBBOMTreeList));
