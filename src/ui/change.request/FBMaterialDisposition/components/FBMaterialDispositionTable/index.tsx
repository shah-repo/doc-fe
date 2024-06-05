import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Typography } from '@material-ui/core';
import { ExcelExport, ExcelExportColumnProps } from '@progress/kendo-react-excel-export';
import { GridKeyDownEvent, GridSelectionChangeEvent, GridToolbar, getSelectedState, getSelectedStateFromKeyDown } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { cloneDeep, each, find, first, get, has, intersection, isEmpty, keys, map, omit, pick } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { MomentFormats, getFormattedDateString } from '../../../../../common/utils/date';
import { changeRequestsActions } from '../../../../../state/ducks/changeRequest';
import { ChangeRequest, ChangeRequestStatus } from '../../../../../state/ducks/changeRequest/types';
import { companySelectors } from '../../../../../state/ducks/company';
import { materialDispositionActions } from '../../../../../state/ducks/materialDisposition';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition, DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import Text from '../../../../components/Text';
import { useFormContext } from '../../../../components/forms/FormContext';
import { Button } from '../../../../components/forms/fields-next';
import { toastError } from '../../../../components/notifications';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';
import { FB, FBSection } from '../../../../form.builder';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import { changeRequestPreviewPath } from '../../../utils/paths';
import ColumnShowHideMDMenu from './components/ColumnShowHideMDMenu';
import { PopupClipboardMenuContext } from './components/PopupClipboardMenu';
import { DATA_ITEM_KEY, DROPDOWN_FIELDS, EMPTY_DROPDOWN_PLACEHOLDER, EXCEL_FILE_NAME, EXISTING_DOC_FIELDS_TO_PICK, FIELDS_TO_PICK, NON_EXISTING_DOC_FIELDS_TO_PICK, SELECTED_FIELD } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { CopiedItems, EditableMDItem, MDItemEditEvent, MaterialDispositionItem } from './types';
import { getExcelColumns, hasConflictingSelections, updateData, updateDataWithCopiedValue } from './utils';

interface props {
  changeRequest?: ChangeRequest
  isShowOnly?: boolean
  setDoNotPrompt?: (state: boolean) => void
}

const FBMaterialDispositionTable: React.FunctionComponent<props> = ({ changeRequest, isShowOnly, setDoNotPrompt }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [editedMDItem, setEditedMDItem] = React.useState<EditableMDItem>();
  const isMDItemAdded = editedMDItem?.[MODE_FIELD] === Mode.add;
  const [isCopyConflictedSelections, setIsCopyConflictedSelections] = React.useState<boolean>(false);
  const [data, setData] = React.useState<EditableMDItem[]>([]);
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<Date>();
  const settings = useSelector(companySelectors.getGeneralSettings);
  const [copiedItems, setCopiedItems] = React.useState<CopiedItems>();
  const [selectedState, setSelectedState] = React.useState<{
    [id: string]: boolean | number[]
  }>({});

  const editMDItem = ({ dataItem }: MDItemEditEvent) => {
    if (!isEmpty(dataItem?.[SELECTED_FIELD]) && !dataItem.isSelected) {
      setCopiedItems(undefined);
    }
    if (isShowOnly || formik.dirty) {
      return;
    }
    const updatedDataItem = omit(dataItem, DROPDOWN_FIELDS);
    const prepareDataItem = {
      ...updatedDataItem,
      onOrderPOAction: dataItem.onOrderPOAction ?? EMPTY_DROPDOWN_PLACEHOLDER,
      inInspectionAction: dataItem.inInspectionAction ?? EMPTY_DROPDOWN_PLACEHOLDER,
      inInventoryAction: dataItem.inInventoryAction ?? EMPTY_DROPDOWN_PLACEHOLDER,
      inWipAction: dataItem.inWipAction ?? EMPTY_DROPDOWN_PLACEHOLDER,
      asFinishedGoodsAction: dataItem.asFinishedGoodsAction ?? EMPTY_DROPDOWN_PLACEHOLDER,
      usedLocation: dataItem.usedLocation ?? EMPTY_DROPDOWN_PLACEHOLDER,
    };
    setEditedMDItem(prepareDataItem as EditableMDItem);
  };
  const discardMDItem = () => {
    setCopiedItems(undefined);
    setEditedMDItem(undefined);
    setSelectedState({});
  };
  const getColumns = () => {
    return columns.filter(({ show }) => show);
  };
  const dialog = useDialog();
  const formContext = useFormContext();
  const parentFormik = useFormikContext();
  const { workspaceState } = FB.useStores();
  const [bulkDataToSubmit, seBulkDataToSubmit] = React.useState<EditableMDItem[]>([]);
  const history = useHistory();

  const load = useActionCreator(materialDispositionActions.loadMaterialDispositionList);
  const updateItem = useActionCreator(materialDispositionActions.updateMDItem);
  const addMDItem = useActionCreator(materialDispositionActions.addMDItem);
  const deleteItem = useActionCreator(materialDispositionActions.deleteMDItem);

  const materialDispositionAsync = useAsync({
    onSuccess: (data: {records: EditableMDItem[], lastRefreshedAt: Date}) => {
      setData(data?.records ?? []);
      setLastRefreshedAt(data?.lastRefreshedAt);
    },
    onError: toastError,
  });

  const containerRef = React.useRef<HTMLDivElement>(null);

  const partAsync = useAsync({
    onSuccess: () => {
      changeRequest?.id && dispatch(changeRequestsActions.loadAudit(changeRequest?.id));
      materialDispositionAsync.start(load, changeRequest?.id, materialDispositionAsync);
      if (formContext.isEditing) {
        history.push(changeRequestPreviewPath(changeRequest?.id ?? ''));
      }
    },
    onError: toastError,
  });

  const fetchMaterialDispositionTableData = () => {
    changeRequest?.id && materialDispositionAsync.start(load, changeRequest.id, materialDispositionAsync);
  };

  const [nonSelectableColumnIndexes, setNonSelectableColumnIndexes] = React.useState<number[]>([]);

  useEffect(() => {
    const data = workspaceState?.getMDTableData;
    if ((isEmpty(data) && formContext.isEditing) || !formContext.isEditing) {
      fetchMaterialDispositionTableData();
    } else if (!isEmpty(data)) {
      setData(data as EditableMDItem[]);
    }

    const columnIndexes: number[] = [];

    each(columns, (column, index) => {
      if (!column.selectable) {
        columnIndexes.push(index);
      }
    });

    setNonSelectableColumnIndexes(columnIndexes);
  }, []);

  const updateUnsavedData = (values: Partial<EditableMDItem>) => {
    const updatedData = updateData(values, data);
    workspaceState?.setMDTableData(updatedData);
    workspaceState?.addMDUpdatedDataId(values.id as string);
    setData(updatedData);
  };

  const updateUnsavedCopiedData = () => {
    const selectedRowIds = keys(selectedState);
    const updatedData = updateDataWithCopiedValue(selectedRowIds, copiedItems as CopiedItems, data);
        workspaceState?.setMDTableData(updatedData);
        selectedRowIds.forEach(id => workspaceState?.addMDUpdatedDataId(id));
        setData(updatedData);
  };

  const formik = useFormik<Partial<EditableMDItem>>({
    initialValues: {},
    onSubmit: (values) => {
      if (hasConflictingSelections(values) && settings?.shouldAutoUpdateLotStatus) {
        onOpen();
        return;
      }

      if (formContext.isEditing) {
        updateUnsavedData(values);
      } else {
        if (values[MODE_FIELD] === Mode.add) {
          addMDTableItem(values as EditableMDItem);
        } else {
          updateMaterialDispositionTableData([values] as EditableMDItem[]);
        }
      }

      discardMDItem();
    },
  });

  const createDraftMDItem = () => setEditedMDItem({
    id: uuidv4(),
    partDocRevId: '',
    basePartDocRevId: '',
    lotDocRevId: '',
    partDocId: '',
    revisionsFromTo: '',
    lotDocId: '',
    arId: '',
    onOrderPOAction: EMPTY_DROPDOWN_PLACEHOLDER,
    inInspectionAction: EMPTY_DROPDOWN_PLACEHOLDER,
    inInventoryAction: EMPTY_DROPDOWN_PLACEHOLDER,
    inWipAction: EMPTY_DROPDOWN_PLACEHOLDER,
    whereUsed: 0,
    asFinishedGoodsAction: EMPTY_DROPDOWN_PLACEHOLDER,
    usedLocation: EMPTY_DROPDOWN_PLACEHOLDER,
    comment: '',
    openedPO: [],
    [MODE_FIELD]: Mode.add,
  });

  const { submitForm, resetForm, setValues } = formik;

  const addMDTableItem = (data: EditableMDItem) => {
    const partToSave = {
      ...pick(data, has(data, 'text') ? NON_EXISTING_DOC_FIELDS_TO_PICK : EXISTING_DOC_FIELDS_TO_PICK),
    };
    partAsync.start(addMDItem, changeRequest?.id, partToSave, partAsync);
  };

  const updateMaterialDispositionTableData = (data: EditableMDItem[]) => {
    const partToSave = {
      materialDispositionEntryUpdates: data.map(dataItem => ({
        materialDispositionId: dataItem.id,
        ...pick(dataItem, FIELDS_TO_PICK),
      })),
    };
    partAsync.start(updateItem, changeRequest?.id, partToSave, partAsync);
  };

  const clearContent = () => {
    onUpdateSelectedCell(EMPTY_DROPDOWN_PLACEHOLDER);
  };

  useEffect(() => {
    if (copiedItems?.value === EMPTY_DROPDOWN_PLACEHOLDER) {
      populateCopiedValue();
    }
  }, [copiedItems]);

  const onClose = () => {
    dialog.close();
    setIsCopyConflictedSelections(false);
  };

  const populateCopiedValue = () => {
    if (!isEmpty(copiedItems)) {
      const copiedDataItem = find(data, { id: first(keys(copiedItems)) });
      const copiedDataItemField = copiedItems?.[copiedDataItem?.id ?? ''] ?? '';
      const copiedDataItemValue = copiedItems?.value;
      let isConflictingSelections = false;
      const selectedRowIds = keys(selectedState);
      const selectedDataItemList = data.filter(dataItem => selectedRowIds.includes(dataItem.id));

      const payload = cloneDeep(selectedDataItemList).map(dataItem => {
        if (!isEmpty(copiedDataItem)) {
          dataItem[copiedDataItemField] = copiedDataItemValue;
        }
        !isConflictingSelections && (isConflictingSelections = hasConflictingSelections(dataItem));
        return dataItem;
      });

      if (isConflictingSelections) {
        onOpen();
        setIsCopyConflictedSelections(isConflictingSelections);
        if (!formContext.isEditing) {
          seBulkDataToSubmit(payload);
        }
        return;
      }

      if (formContext.isEditing) {
        updateUnsavedCopiedData();
        copyClipboardPopupMenu.close();
        return;
      }
      updateMaterialDispositionTableData(payload);
    }
    copyClipboardPopupMenu.close();
  };

  const onConfirm = () => {
    const values = formik.values;
    if (formContext.isEditing) {
      if (!copyClipboardPopupMenu.isOpen) {
        updateUnsavedData(values);
      } else {
        updateUnsavedCopiedData();
      }
    } else if ((!isEmpty(copiedItems) || isCopyConflictedSelections) && !isEmpty(bulkDataToSubmit)) {
      updateMaterialDispositionTableData(bulkDataToSubmit);
    } else {
      if (values[MODE_FIELD] === Mode.add) {
        addMDTableItem(values as EditableMDItem);
      } else {
        updateMaterialDispositionTableData([values] as EditableMDItem[]);
      }
    }
    copyClipboardPopupMenu.close();
    dialog.close();
    setIsCopyConflictedSelections(false);
    discardMDItem();
  };

  const deleteMDItemAsync = useAsync({
    onSuccess: fetchMaterialDispositionTableData,
    onError: toastError,
  });

  const deleteMDItem = () => {
    if (!editedMDItem?.id) {
      return;
    }

    deleteMDItemAsync.start(deleteItem, changeRequest?.id, editedMDItem?.id, deleteMDItemAsync);
    discardMDItem();
  };

  const onOpen = () => {
    dialog.open();
  };

  const onSelectCell = (dataItem: EditableMDItem, field: string) => {
    if (dataItem?.id && !isShowOnly) {
      setCopiedItems({ [dataItem.id]: field, value: get(dataItem, field, EMPTY_DROPDOWN_PLACEHOLDER) as string });
    }
  };

  const onUpdateSelectedCell = (value: string) => {
    setCopiedItems(prevVal => ({ ...prevVal, value }));
  };

  useEffect(() => {
    if (editedMDItem) {
      setColumns(prevCols => schema.map(column => {
        const prevCol = prevCols.find(prevCol => prevCol.id === column.id);
        return { ...column, show: prevCol?.show };
      }));
    }
    resetForm({ values: editedMDItem ?? {} });
  }, [editedMDItem, setValues, resetForm]);

  useEffect(() => {
    const data = workspaceState?.getMDTableData ?? [];
    const updatedDataItemIds = workspaceState?.getMDUpdatedDataIds ?? [];
    const updatedData = data.filter(dataItem => updatedDataItemIds.includes(dataItem.id));
    if (formContext.isEditing && parentFormik.isSubmitting && !isEmpty(updatedData)) {
      setDoNotPrompt?.(true);
      updateMaterialDispositionTableData(updatedData);
      workspaceState?.setMDTableData([]);
    }
  }, [parentFormik?.isSubmitting]);

  const copyClipboardPopupMenu = useDialog();

  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: editMDItem,
    onConfirm: submitForm,
    onDiscard: discardMDItem,
    onDelete: deleteMDItem,
    onSelectCell: onSelectCell,
  });

  const [columns, setColumns] = React.useState<Array<ColumnDefinition<EditableMDItem>>>(schema);

  const onColumnShowHide = ({ field }: Partial<ColumnDefinition<EditableMDItem>>) => {
    const dataColumns = map(columns, (column: ColumnDefinition<EditableMDItem>) => {
      if (column.field === field) {
        column.show = !column.show;
      }
      return column;
    });
    setColumns(dataColumns);
  };

  const rowRender: DataGridProps<MaterialDispositionItem>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as MaterialDispositionItem;
    const isUpdating = [Mode.edit, Mode.add].includes(item[MODE_FIELD]);

    if (!isUpdating) {
      return row;
    }

    const editedRow = React.cloneElement(
      row,
      {
        className: cx(row.props.className, classes.updatingRow),
      },
    );

    return (
      <FormikProvider value={formik}>
        {editedRow}
      </FormikProvider>
    );
  };

  const MDItemList = data?.reduce<EditableMDItem[]>((list, item) => {
    const isMDItemEdited = editedMDItem && isEmpty(copiedItems) && editedMDItem?.id === item.id;

    return [
      ...list,
      {
        ...(isMDItemEdited ? editedMDItem : item),
        lotDocId: item.lotDocId ?? EMPTY_DROPDOWN_PLACEHOLDER,
        [MODE_FIELD]: isMDItemEdited ? Mode.edit : Mode.show,
        [SELECTED_FIELD]: isEmpty(copiedItems) ? undefined : selectedState?.[item.id],
      },
    ];
  }, isMDItemAdded ? [editedMDItem] : []);

  const _export = React.useRef<ExcelExport | null>(null);
  const exportToExcel = () => {
    if (_export.current !== null) {
      _export.current.save(MDItemList, getExcelColumns(getColumns()) as ExcelExportColumnProps[]);
    }
  };

  useEffect(() => {
    if (!isEmpty(selectedState) && keys(selectedState).length > 1) {
      copyClipboardPopupMenu.open();
    }
  }, [selectedState]);

  useEffect(() => {
    if (!copyClipboardPopupMenu.isOpen) {
      setSelectedState({});
      setCopiedItems(undefined);
    }
  }, [copyClipboardPopupMenu.isOpen]);

  const onSelectionChange = (event: GridSelectionChangeEvent) => {
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedState,
      dataItemKey: DATA_ITEM_KEY,
    });
    let skipIfOtherColumnSelected = false;
    each(newSelectedState, (columnIndexes) => {
      const selectedFieldIndex = columnIndexes as number[];
      skipIfOtherColumnSelected = selectedFieldIndex?.length === 1 && intersection(nonSelectableColumnIndexes, columnIndexes as number[])?.length === 0;
    });
    if (skipIfOtherColumnSelected && !copyClipboardPopupMenu.isOpen) {
      setSelectedState(newSelectedState);
    }
  };

  const onKeyDown = (event: GridKeyDownEvent) => {
    const newSelectedState = getSelectedStateFromKeyDown({
      event,
      selectedState: selectedState,
      dataItemKey: DATA_ITEM_KEY,
    });
    setSelectedState(newSelectedState);
  };

  return (<>
    <PopupClipboardMenuContext.Provider value={{ copyClipboardPopupMenu, selectedState, copiedItems, containerRef: containerRef.current, onUpdateSelectedCell, populateCopiedValue, clearContent }}>
      <FBSection label={translate('approvalRequest.material.disposition.section.heading')}>
        <Button
          kind="ghost"
          size="small"
          className={classes.addButton}
          startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
          onClick={createDraftMDItem}
          data-cy="add-md-small-btn"
          disabled={isShowOnly || formContext?.isEditing}
        >
          {translate('form.builder.add.item')}
        </Button>
      </FBSection>
      <ExcelExport ref={_export} fileName={EXCEL_FILE_NAME}>
        <KendoDataGrid<EditableMDItem>
          data={MDItemList}
          schema={getColumns()}
          fullWidth
          className={classes.rootMDTable}
          containerRef={containerRef}
          hasBoxScrollbars
          onRowClick={editMDItem}
          selectedField={SELECTED_FIELD}
          dataItemKey={DATA_ITEM_KEY}
          selectable={{
            enabled: true,
            drag: true,
            cell: true,
            mode: 'multiple',
          }}
          filterable={true}
          navigatable={true}
          rowRender={rowRender}
          onSelectionChange={onSelectionChange}
          onKeyDown={onKeyDown}
          loading={materialDispositionAsync.isLoading || partAsync.isLoading || deleteMDItemAsync.isLoading}
          resizable={true}
        >
          <GridToolbar>
            <Grid container justify="flex-end"
              className={classes.toolbarContainer}
            >
              <Grid item>
                <Grid container justify="flex-end">
                  <Grid className={classes.refreshContainer}
                  >
                    <Grid container>
                      { changeRequest?.state === ChangeRequestStatus.Draft && <StyleTooltip
                        title={translate('approvalRequest.material.disposition.refresh')}
                        placement="top"
                        arrow
                      >
                        <FontAwesomeIcon icon={regular('arrows-rotate')} onClick={fetchMaterialDispositionTableData} className={classes.icon} />
                      </StyleTooltip> }
                      { lastRefreshedAt && <Typography
                        variant="h6"
                        component="h6"
                        className={classes.refreshText}
                      >
                        <Text translation="approvalRequest.material.disposition.refresh.date"
                          values={{ date: getFormattedDateString(lastRefreshedAt, MomentFormats.BriefDate) }}
                        />
                      </Typography> }
                    </Grid>
                  </Grid>
                  <Grid item >
                    <StyleTooltip
                      title={translate('common.download')}
                      placement="top"
                      arrow
                    >
                      <FontAwesomeIcon data-cy="excel-download"
                        className={classes.icon}
                        onClick={exportToExcel}
                        icon={solid('arrow-down-to-line')} />
                    </StyleTooltip>
                  </Grid>
                  <Grid item
                    data-cy="show-hide-columns"
                  >
                    <ColumnShowHideMDMenu
                      columnDefinition={columns}
                      onChange={onColumnShowHide}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </GridToolbar>
        </KendoDataGrid>
      </ExcelExport>
    </PopupClipboardMenuContext.Provider>
    {!isShowOnly && !formContext?.isEditing && <Button
      kind="add"
      fullWidth
      attached
      onClick={createDraftMDItem}
      data-cy="add-md-item"
    >
      {translate('form.builder.add.item')}
    </Button>}
    <AlertDialog
      dialog={dialog}
      message="approvalRequest.material.disposition.warning.alert"
      cancelAction={onClose}
      confirmAction={onConfirm} />
  </>);
};

export default FBMaterialDispositionTable;
