import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
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
  TreeListDataStateChangeEvent, TreeListDraggableRow, TreeListFilterChangeEvent, TreeListRowDragEvent, treeToFlat,
} from '@progress/kendo-react-treelist';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import {
  chain,
  get,
  isEmpty,
  isObject,
  map,
  omit,
  replace,
  tail,
  take,
  uniq,
} from 'lodash';
import { reaction, toJS } from 'mobx';
import { useObserver } from 'mobx-react';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { SM } from '../../../../../App';
import { ReactComponent as CloseIcon } from '../../../../../assets/images/leftPanel/close.svg';
import { translate } from '../../../../../common/intl';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import Loader from '../../../../components/common/kendo/Loader';
import { Button as AddButton } from '../../../../components/forms/fields-next';
import { toastError } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';
import { bomDisabledChangeControl, disableOtherFieldsChangeControl, getEnabledFieldsForEditing, substitutingSupersededDisabledChangeControl } from '../../../../document.revision/utils/helpers';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import useHover from '../../../../hooks/useHover';
import { withThemeNext } from '../../../../layout/theme-next';
import FBDataStore from '../../../FBStore/FBDataStore';
import { FBBOM } from '../../../index';
import { BOM, BOMEditEvent, EditableBOM } from '../../interface';
import FBBOMDetailDrawer from '../drawer/AlternateParts';
import DocumentRevisionDrawer from '../drawer/DocumentRevisionDrawer';
import { ActionsCell } from './column.templates/Actions';
import {
  ColumnMenuContext,
  CustomColumnMenu,
} from './column.templates/CustomColumnMenu';
import ColumnShowHideTreeMenu from './common/ColumnShowHideTreeMenu';
import {
  ADD_FIELD,
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
  BOMState,
  CustomTreeListColumnProps,
  CustomTreeListExpandChangeEvent,
  CustomTreeListRowProps,
  FBBOMProps,
} from './interface';
import { TreeListSchema } from './schema';
import useStyles from './styles';
import {
  getExcelColumns,
  hasSameParent,
  processBOMData,
  updateDataAtLevels,
} from './utils';
import WhereUsedDialog from './WhereUsedDialog';

const FBBOMTreeList: React.FC<FBBOMProps> = ({
  documentRevision,
  isDisabled,
  isDiffViewEnabled = false,
  isShowOnly = false,
  isUpgradeDisabled = false,
  isMaxDialogOpen = false,
  isSliderView = false,
}) => {
  const { _tabsState } = SM.useStores();
  const dispatch = useDispatch();
  const size = useObserver(() => _tabsState?.contentSize);
  const { _documentRevisionFormState } = SM.useStores();

  const classes = useStyles({
    size,
    isMaximizeView: _documentRevisionFormState?.isMaximizedView,
  });
  const [state, setState] = React.useState<BOMState>({
    data: [],
    dataState: {
      sort: [],
      filter: [],
    },
    expanded: [],
    inEdit: [],
  });
  const maxDialog = useDialog();
  const [selectedPartLevel, setSelectedPartLevel] = React.useState<{
    level: number[]
    dataItem: EditableBOM
  }>();
  const treeListRef = useRef(null);

  const [showTree, setShowTree] = useState(false);
  isUpgradeDisabled = isUpgradeDisabled || substitutingSupersededDisabledChangeControl(documentRevision);
  const isEditingLineItemsDisallowed = bomDisabledChangeControl(documentRevision);
  const enabledFieldsForEditing = getEnabledFieldsForEditing(documentRevision);
  const inRestrictedEditMode = disableOtherFieldsChangeControl(documentRevision);
  const hasPermisstionToEditRestrictedPart = useSelector(getHasPermission(Permission.RESTRICTED_PART_EDIT_ADMIN));

  const treeListAsync = useAsync({
    onSuccess: ({
      bomTreeRelations,
      parentRevDetails,
    }: {
      bomTreeRelations: BOM[]
      parentRevDetails: BOM
    }) => {
      formik.setValues({});
      _documentRevisionFormState?.setIsBOMExists(bomTreeRelations.length > 0);
      const bomProccessedData = processBOMData(
        [...bomTreeRelations],
        parentRevDetails,
      );
      updateState({
        ...state,
        data: [...bomProccessedData],
        inEdit: [],
        expanded: uniq([...state.expanded, ...[bomProccessedData[0].id]]),
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
      _documentRevisionFormState?.setDirty(false);
      _documentRevisionFormState?.setBOMChangesInProgress(false);
      treeListAsync.start(
        fetchBOMTreeList,
        documentRevision.id,
        documentRevision.documentId,
        treeListAsync,
      );
      dispatch(documentRevisionsActions.loadAudit(documentRevision.id));
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
  const reloadBOM = () => {
    _documentRevisionFormState?.setBOMChangesInProgress(false);
    treeListAsync.start(
      fetchBOMTreeList,
      documentRevision.id,
      documentRevision.documentId,
      treeListAsync,
    );
  };
  useEffect(() => {
    if (!documentRevision || isShowOnly) {
      return;
    }
    reloadBOM();
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
        _documentRevisionFormState?.setBOMChangesInProgress(false);
        dispatch(documentRevisionsActions.reload(documentRevision?.id));
        treeListAsync.start(
          fetchBOMTreeList,
          documentRevision.id,
          documentRevision.documentId,
          treeListAsync,
        );
      }
    },
  );

  const [isPartsDrawerOpened, setIsPartsDrawerOpened] = React.useState(false);
  const [selectedDataItem, setSelectedDataItem] = React.useState(undefined);

  const openDetailDrawer = (dataItem) => {
    setIsPartsDrawerOpened(true);
    setSelectedDataItem(dataItem);
  };
  const closeDetailDrawer = () => {
    FBDataStore.selectedSliderInfo = undefined;
    setIsPartsDrawerOpened(false);
    setSelectedDataItem(undefined);
    _documentRevisionFormState?.setBOMChangesInProgress(false);
    dispatch(documentRevisionsActions.reload(documentRevision?.id));
    treeListAsync.start(
      fetchBOMTreeList,
      documentRevision.id,
      documentRevision.documentId,
      treeListAsync,
    );
  };

  const schema: CustomTreeListColumnProps[] = TreeListSchema({ openDetailDrawer });

  const [columns, setColumns]
    = React.useState<CustomTreeListColumnProps[]>(schema);

  const onExpandChange = (event: CustomTreeListExpandChangeEvent) => {
    if (!isExactBOMViewWindow()) {
      return;
    }
    const expanded = event.value
      ? state.expanded.filter((id) => id !== event.dataItem.id)
      : uniq([...state.expanded, event.dataItem.id]);

    updateState({
      ...state,
      expanded,
    });
  };

  const handleDataStateChange = (event: TreeListDataStateChangeEvent) => {
    if (!isExactBOMViewWindow()) {
      return;
    }
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

  const fetchHasATreeAction = useActionCreator(
    documentRevisionsActions.fetchHasATree,
  );
  const fetchHasATreeAsync = useAsync({
    onSuccess: (statusObj: BOM | undefined) => {
      if (statusObj && statusObj[documentRevision?.id]) {
        setShowTree(true);
      }
    },
  });
  const fetchHasATree = (docRevId) => {
    fetchHasATreeAsync.start(
      fetchHasATreeAction,
      [docRevId],
      fetchHasATreeAsync,
    );
  };

  useEffect(() => {
    if (!isShowOnly) {
      fetchHasATree(documentRevision?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentRevision?.id]);

  const [selectedPart, setSelectedPart] = useState<EditableBOM>();
  const confirmDeletePart = (e: React.MouseEvent<HTMLElement>) => {
    const partInfo = selectedPart?.id?.split(SELECTED_PART_KEY_SEPARATOR) ?? [];
    partAsync.start(deleteBOMBranch, partInfo[1], partInfo[0], partAsync);
    discardBOM(selectedPart);
    confirmationDialog.close();
  };

  const cancelDeletePart = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    confirmationDialog.close();
  };

  const addExpandField = (dataTree: BOM[]) => {
    const { expanded, inEdit } = state;
    return useMemo(() => mapTree(dataTree, SUB_ITEMS_FIELD, (item) =>
      extendDataItem(item, SUB_ITEMS_FIELD, {
        [EXPAND_FIELD]: expanded.includes(item.id),
        [MODE_FIELD]: Boolean(inEdit.find((i) => i.id === item.id)),
      }),
    ), [dataTree, expanded, inEdit]);
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
    return addExpandField(sortedData as BOM[]);
  };

  const onColumnShowHide = ({ field }: CustomTreeListColumnProps) => {
    const dataColumns = map(columns, (column: CustomTreeListColumnProps) => {
      if (column.field === field) {
        column.isHidden = !column.isHidden;
      }
      return column;
    });
    setColumns(dataColumns);
  };

  const formik = useFormik<Partial<EditableBOM>>({
    initialValues: {},
    onSubmit: (values) => {
      const partInfo = omit(values, [MODE_FIELD, 'dataItem']);
      if (isObject(partInfo.unit)) {
        partInfo.unit = get(partInfo, 'unit.value');
      }
      if (values[ADD_FIELD]) {
        if (!partInfo.parentNodeRevId) {
          partInfo.parentNodeRevId = documentRevision.id;
        }
        if (!partInfo.parentNodeDocumentId) {
          partInfo.parentNodeDocumentId = documentRevision.documentId;
        }
        partInfo.isDeleted = false;
        partInfo.quantity = partInfo.quantity ? +partInfo.quantity : 0;
        if (validate(partInfo)) {
          partAsync.start(addBOMBranch, partInfo, partAsync);
        }
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
      displayRevision: '',
      status: '' as DocumentRevisionStatus,
      displayStatus: '',
      name: '',
      docId: '',
      cost: '',
      quantity: 1,
      leadTime: '',
      unit: '',
      comment: '',
      refDesignator: '',
      attachmentNames: [],
      [MODE_FIELD]: true,
      [ADD_FIELD]: true,
      isEditEnabled: true,
      isParentOwner: true,
    };
  };

  const validate = (partInfo: Partial<Partial<EditableBOM>>) => {
    return partInfo.childNodeRevId;
  };

  const isNewBOMAdditionInProgress = () => {
    return _documentRevisionFormState?.bomChangesInProgress;
  };

  const addBOM = () => {
    if (isNewBOMAdditionInProgress() || maxDialog.isOpen) {
      return;
    }
    _documentRevisionFormState?.setDirty(true);
    const newBOM: EditableBOM = createNewItem();
    state.data[0][SUB_ITEMS_FIELD] = state.data[0][SUB_ITEMS_FIELD]?.filter(
      (data) => !data[ADD_FIELD],
    );
    state.data[0][SUB_ITEMS_FIELD]?.push(newBOM);
    _documentRevisionFormState?.setBOMChangesInProgress(true);
    updateState({
      ...state,
      data: [...state.data],
      expanded: [state.data[0].id],
      inEdit: [newBOM],
    });
  };

  const editBOM = ({ dataItem, level }: BOMEditEvent) => {
    if (dataItem.id === documentRevision.id) {
      return;
    }

    if (dataItem.inEdit || dataItem.isDeleted || !dataItem.isEditEnabled) {
      return;
    }

    if (isNewBOMAdditionInProgress()) {
      return;
    }

    if (maxDialog.isOpen) {
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
    if (isNewBOMAdditionInProgress() && !dataItem[ADD_FIELD]) {
      state.data = updateDataAtLevels(
        [...state.data],
        level,
        dataItem,
        false,
      ) as BOM[];
    }
    const editBOMInfo = extendDataItem(dataItem, SUB_ITEMS_FIELD);
    const childRevId = editBOMInfo.id.split(SELECTED_PART_KEY_SEPARATOR)[0];
    editBOMInfo.customDocId = `${childRevId}${SELECTED_PART_KEY_SEPARATOR}${editBOMInfo.documentId}`;
    editBOMInfo.childNodeRevId = childRevId;
    formik?.setFieldValue('revision', editBOMInfo?.revision);
    _documentRevisionFormState?.setBOMChangesInProgress(true);
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
        const updatedData = updateDataAtLevels(
          [...state.data],
          selectedPartLevel?.level,
          dataItem,
          false,
        ) as BOM[];
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
    _documentRevisionFormState?.setBOMChangesInProgress(false);
    updateState({
      ...state,
      inEdit: [],
    });

    formik?.resetForm();
  };

  const removeBOM = (dataItem) => {
    if (dataItem.isDisabled) {
      return;
    }
    confirmationDialog.open();
    setSelectedPart(dataItem);
  };

  const onRestore = (dataItem) => {
    const partInfo = dataItem.id?.split(SELECTED_PART_KEY_SEPARATOR);
    const payload = {
      childNodeRevId: partInfo[0],
      isDeleted: false,
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
  const isExactBOMViewWindow = () => {
    return _documentRevisionFormState?.isMaximizedView === isMaxDialogOpen;
  };
  const onChildPartAdd = (dataItem: EditableBOM, updatedState?: BOMState) => {
    if (isDisabled || !isExactBOMViewWindow()) {
      return;
    }
    const newBOM: EditableBOM = createNewItem();
    newBOM.parentNodeDocumentId = dataItem.documentId;
    newBOM.parentNodeRevId = dataItem.id.split(SELECTED_PART_KEY_SEPARATOR)[0];
    const updatedBOMState = _documentRevisionFormState?.getBOMInfo
      ? toJS(_documentRevisionFormState?.getBOMInfo)
      : undefined;
    const level = updatedState
      ? toJS(_documentRevisionFormState?.getChildPartInfo?.level)
      : selectedPartLevel?.level;
    const stateData = updatedState ? updatedBOMState?.data : state.data;
    if (stateData) {
      const updatedData = updateDataAtLevels(
        [...stateData],
        level,
        newBOM,
        true,
      ) as BOM[];
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
    isDiffViewEnabled = Boolean(_documentRevisionFormState?.isDiffViewEnabled);
  });
  const showDiffView = documentRevision.revision > 1;
  const showHideDiff = () => {
    _documentRevisionFormState?.toggleDiffView();
    if (isDiffViewEnabled) {
      updateState({
        ...state,
        expanded: [state.data[0].id],
      });
    } else {
      handleExpandAll();
    }
  };

  const disableEditInRestrictedEditMode = (item) => {
    return inRestrictedEditMode && ((!item.isParentOwner && !hasPermisstionToEditRestrictedPart) || isEditingLineItemsDisallowed);
  };

  const rowRender = (row, props: CustomTreeListRowProps) => {
    const item = props.dataItem as EditableBOM;
    const parentChildRelkey = item.parentDocId ? `bom-row-${item.parentDocId}-${item.docId}` : `bom-row-${item.docId}`;
    item.isDisabled = isDisabled;
    item.isMaximizedWindow = isMaxDialogOpen;
    item.isUpgradeDisabled = isUpgradeDisabled;
    item.enabledFieldsForEditing = enabledFieldsForEditing;
    item.inRestrictedEditMode = inRestrictedEditMode;

    if (item.isDeleted && !_documentRevisionFormState?.isDiffViewEnabled) {
      return;
    }

    if (isEmpty(item.refDesignator)) {
      item.refDesignator = '-';
    }

    const modifiedProps = {
      className: cx(replace(row?.props?.className, 'k-alt', ''), {
        [classes.WhiteBg]: isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.grayBg]: !isEmpty(item[SUB_ITEMS_FIELD]),
        [classes.deletedBg]:
          item.isDeleted || (isDiffViewEnabled && item.replacementStatus),
        [classes.inprogressBg]: item.inProgress && isDiffViewEnabled,
      }),
    };

    const showWithoutActions = !item[MODE_FIELD]
      || !item.isEditEnabled
      || (!inRestrictedEditMode && !item.isParentOwner)
      || disableEditInRestrictedEditMode(item);

    if (showWithoutActions) {
      return React.cloneElement(row, {
        ...modifiedProps,
        ['data-cy' as string]: `bom-row-${item.docId}`,
        ['data-parent-rel' as string]: parentChildRelkey,
      });
    }

    const isOwner = item.isOwner;
    const isAddPartEnabled
      = isOwner
      && ![
        DocumentRevisionStatus.Deprecated,
        DocumentRevisionStatus.Voided,
        DocumentRevisionStatus.Obsolete,
        DocumentRevisionStatus.Released,
      ].includes(item.status);

    const actions = (
      <td className={classes.actionsCell}>
        <ActionsCell
          dataItem={item}
          onConfirm={formik?.submitForm}
          onDiscard={discardBOM}
          onDelete={
            isOwner || item.isParentOwner || (item?.childNodes || []).length > 0
              ? removeBOM
              : undefined
          }
          onRestore={onRestore}
          onReorder={onReorder}
          isAddPartEnabled={isAddPartEnabled}
          onChildPartAdd={onChildPartAdd}
          rootClassName={classes.popperHolder}
        />
      </td>);

    return React.cloneElement(
      row,
      {
        ...modifiedProps,
        ['data-cy' as string]: `bom-row-${item.docId}`,
        ['data-parent-rel' as string]: parentChildRelkey,
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
      if (item[SUB_ITEMS_FIELD] && !isEmpty(item[SUB_ITEMS_FIELD])) {
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
    const tableColumns = getExcelColumns(columns);
    const options = _export.workbookOptions(data, tableColumns);

    _export.save(options);
  };
  const openMaximizeDialog = () => {
    maxDialog.open();
    _documentRevisionFormState?.setIsMaximizedView(true);
  };
  const closeMaximizeDialog = () => {
    maxDialog.close();
    _documentRevisionFormState?.setIsMaximizedView(false);
    reloadBOM();
  };
  const [maxmizeIconContainerRef, isMaxIconHovered]
    = useHover<HTMLButtonElement>();
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
            {showDiffView && (
              <Grid
                item
                data-cy="show-hide-diff"
                className={cx(classes.diffContainer, {
                  [classes.disabled]: isShowOnly,
                })}
              >
                <span
                  data-cy="bom-hide-show-diff-button"
                  className={classes.toggleIconContainer}
                  onClick={showHideDiff}
                >
                  <FontAwesomeIcon
                    className={classes.toggleIcon}
                    size="lg"
                    icon={
                      isDiffViewEnabled
                        ? regular('toggle-large-on')
                        : regular('toggle-large-off')
                    }
                  />
                  <span className={classes.toggleIconLabel}>
                    {translate(
                      isDiffViewEnabled ? 'bom.hide.diff' : 'bom.show.diff',
                    )}
                  </span>
                </span>
              </Grid>
            )}
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
            {showTree && (
              <Grid
                item
                data-cy="where-used-view"
                className={cx({ [classes.disabled]: isShowOnly })}
              >
                <StyleTooltip
                  title={translate('bom.whereUsed.dialog.title')}
                  placement="top"
                  arrow
                >
                  <FontAwesomeIcon
                    className={classes.viewIcon}
                    icon={solid('tree-deciduous')}
                    onClick={openWhereUsedDialog}
                  />
                </StyleTooltip>
              </Grid>
            )}
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
            {!isMaxDialogOpen && (
              <Grid
                item
                data-cy="maximize"
                className={classes.maximizeIconContainer}
              >
                <StyleTooltip
                  title={translate('bom.maximize.tooltip')}
                  placement="top"
                  arrow
                  ref={maxmizeIconContainerRef}
                  onClick={openMaximizeDialog}
                >
                  <FontAwesomeIcon
                    icon={
                      isMaxIconHovered
                        ? solid('arrows-maximize')
                        : regular('arrows-maximize')
                    }
                  />
                </StyleTooltip>
              </Grid>
            )}
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
    return columns.filter(({ isHidden }) => !isHidden);
  };

  const onColumnReorder = (event: TreeListColumnReorderEvent) => {
    if (!isExactBOMViewWindow()) {
      return;
    }
    setColumns(event.columns as CustomTreeListColumnProps[]);
  };

  const onFilterChange = (event: TreeListFilterChangeEvent) => {
    if (!isExactBOMViewWindow()) {
      return;
    }
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
        setColumns(newColumns);
      }
    },
    [columns],
  );

  const onRowDrop = (event: TreeListRowDragEvent) => {
    if (
      isDisabled
      || !event?.draggedItem?.isEditEnabled
      || event?.draggedItem?.isDeleted
      || !event?.draggedItem.isParentOwner
    ) {
      return false;
    }
    if (
      event?.draggedOver
      && hasSameParent(event?.dragged, event?.draggedOver)
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
              childNodeRevId: draggedChild.id.split(
                SELECTED_PART_KEY_SEPARATOR,
              )[0],
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
      .value();
  };

  useEffect(
    () =>
      reaction(
        () => _documentRevisionFormState?.childPartInfo,
        (info) => {
          if (info?.dataItem) {
            const dataItem = toJS(info?.dataItem) as EditableBOM;
            const level = toJS(info?.level);
            setSelectedPartLevel({ dataItem, level });
            _documentRevisionFormState?.setBOMChangesInProgress(true);
            onChildPartAdd(
              dataItem,
              toJS(_documentRevisionFormState?.getBOMInfo),
            );
          }
        },
      ),
    [_documentRevisionFormState?.childPartInfo],
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
      <Grid item>
        <FormikProvider value={formik}>
          <ColumnMenuContext.Provider
            value={{
              columns: getColumns(),
              onLock,
              onColumnShowHide,
              isMaximizedView:
                _documentRevisionFormState?.isMaximizedView ?? false,
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
                    rowHeight={50}
                    scrollable="virtual"
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
                      _documentRevisionFormState?.isMaximizedView
                        ? undefined
                        : (props) => (
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
                    onRowClick={editBOM}
                    onColumnReorder={onColumnReorder}
                    onFilterChange={onFilterChange}
                    resizable={TREELIST_CONFIG.resizable}
                    reorderable={TREELIST_CONFIG.reorderable}
                    sortable={TREELIST_CONFIG.sortable}
                    toolbar={renderToolbar}
                    cellRender={cellRender}
                    onRowDrop={onRowDrop}
                    row={TreeListDraggableRow}
                  />
                </ExcelExport>
                {(treeListAsync.isLoading
                  || partAsync.isLoading
                  || partChangeOrderAsync.isLoading) && <Loader />}
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
            onClick={addBOM}
          >
            {translate('form.builder.add.item')}
          </AddButton>
        )}
      </Grid>
      {whereUsedDialog.isOpen && (
        <WhereUsedDialog
          docRevId={documentRevision.id}
          whereUsedDialog={whereUsedDialog}
          closeDialog={closeWhereUsedDialog}
        />
      )}
      <FBBOMDetailDrawer {...{ isDrawerOpened: isPartsDrawerOpened, closeDrawer: closeDetailDrawer, dataItem: selectedDataItem }} >
        <DocumentRevisionDrawer {...{ dataItem: selectedDataItem, closeDrawer: closeDetailDrawer, isSliderView: isPartsDrawerOpened }} />
      </FBBOMDetailDrawer>
      <Dialog
        open={maxDialog.isOpen}
        fullScreen
        onEscapeKeyDown={maxDialog.close}
        onBackdropClick={maxDialog.close}
        style={{ zIndex: 30 }}
      >
        <DialogTitle classes={{ root: classes.customDialogTitle }}>
          <IconButton
            className={classes.closeButton}
            onClick={closeMaximizeDialog}
          >
            <StyleTooltip
              title={<Text translation="common.close" />}
              placement="top"
              arrow
            >
              <CloseIcon onClick={closeMaximizeDialog} />
            </StyleTooltip>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FBBOM
            documentRevision={documentRevision}
            isDisabled={isDisabled}
            isShowOnly={isShowOnly}
            isUpgradeDisabled={isUpgradeDisabled}
            isMaxDialogOpen={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(withThemeNext(React.forwardRef(FBBOMTreeList)));
