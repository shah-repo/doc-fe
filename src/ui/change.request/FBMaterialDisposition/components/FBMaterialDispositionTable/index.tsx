import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Typography } from '@material-ui/core';
import { ExcelExport, ExcelExportColumnProps } from '@progress/kendo-react-excel-export';
import { GridKeyDownEvent, GridSelectionChangeEvent, GridToolbar, getSelectedState, getSelectedStateFromKeyDown } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { cloneDeep, each, find, first, get, has, intersection, isEmpty, isUndefined, keys, map, omit, pick } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { MomentFormats, getFormattedDateString } from '../../../../../common/utils/date';
import { ChangeRequest, ChangeRequestStatus } from '../../../../../state/ducks/changeRequest/types';
import { companySelectors } from '../../../../../state/ducks/company';
import { materialDispositionActions } from '../../../../../state/ducks/materialDisposition';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition, DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import Text from '../../../../components/Text';
import { useFormContext } from '../../../../components/forms/FormContext';
import { toastError } from '../../../../components/notifications';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';
import { FB } from '../../../../form.builder';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import { changeRequestPreviewPath } from '../../../utils/paths';
import ColumnShowHideMDMenu from './components/ColumnShowHideMDMenu';
import { PopupClipboardMenuContext } from './components/PopupClipboardMenu';
import { DATA_ITEM_KEY, DROPDOWN_FIELDS, EMPTY_DROPDOWN_PLACEHOLDER, EXCEL_FILE_NAME, FIELDS_TO_PICK, MATERIAL_DISPOSITION_TABLE_NAME, SELECTED_FIELD } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableMDItem, MDItemEditEvent, MaterialDispositionItem } from './types';
import { getExcelColumns, hasConflictingSelections, preparePayload } from './utils';

interface props {
  changeRequest?: ChangeRequest
  isShowOnly?: boolean
  setDoNotPrompt?: (state: boolean) => void
}

const FBMaterialDispositionTable: React.FunctionComponent<props> = ({ changeRequest, isShowOnly, setDoNotPrompt }) => {
  const classes = useStyles();
  const [editedMDItem, setEditedMDItem] = React.useState<EditableMDItem>();
  const [isCopyConflictedSelections, setIsCopyConflictedSelections] = React.useState<boolean>(false);
  const [data, setData] = React.useState<EditableMDItem[]>([]);
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<Date>();
  const settings = useSelector(companySelectors.getGeneralSettings);
  const [copiedItems, setCopiedItems] = React.useState<{
    [id: string]: string
    value: string
  }>();
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
  const { formState } = FB.useStores();
  const [bulkDataToSubmit, seBulkDataToSubmit] = React.useState<EditableMDItem[]>([]);
  const history = useHistory();

  const load = useActionCreator(materialDispositionActions.loadMaterialDispositionList);
  const updateItem = useActionCreator(materialDispositionActions.updateMDItem);
  const materialDispositionAsync = useAsync({
    onSuccess: (data: {records: EditableMDItem[], lastRefreshedAt: Date}) => {
      setData(data?.records ?? []);
      setLastRefreshedAt(data?.lastRefreshedAt);
    },
    onError: toastError,
  });

  const partAsync = useAsync({
    onSuccess: () => {
      materialDispositionAsync.start(load, changeRequest?.id, materialDispositionAsync);
      if (formContext.isEditing) {
        history.push(changeRequestPreviewPath(changeRequest?.id ?? ''));
      }
    },
    onError: toastError,
  });

  const fetchMaterialDispositionTableData = () => {
    materialDispositionAsync.start(load, changeRequest?.id, materialDispositionAsync);
  };

  const [nonSelectableColumnIndexes, setNonSelectableColumnIndexes] = React.useState<number[]>([]);

  useEffect(() => {
    const data = formState?.getFieldValue(MATERIAL_DISPOSITION_TABLE_NAME);
    if ((isUndefined(data) && formContext.isEditing) || !formContext.isEditing) {
      fetchMaterialDispositionTableData();
    } else {
      setData(data);
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
    const dataToSubmit = !isEmpty(values) ? preparePayload(values, data) : bulkDataToSubmit;
    formState?.setFieldValue(MATERIAL_DISPOSITION_TABLE_NAME, [...dataToSubmit]);
    setData(dataToSubmit);
  };

  const formik = useFormik<Partial<EditableMDItem>>({
    initialValues: {},
    onSubmit: (values) => {
      if (hasConflictingSelections(values) && settings?.shouldAutoUpdateLotStatus) {
        onOpen();
      } else {
        if (formContext.isEditing) {
          updateUnsavedData(values);
        } else {
          updateMaterialDispositionTableData(values, data);
        }
        discardMDItem();
      }
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  const updateMaterialDispositionTableData = (values: Partial<EditableMDItem> | null, data: EditableMDItem[]) => {
    const partToSave = {
      materialDispositionEntryUpdates: data.map(dataItem => {
        const updatedValues = values?.id === dataItem.id ? pick(values, FIELDS_TO_PICK) : pick(dataItem, FIELDS_TO_PICK);
        return {
          materialDispositionId: dataItem.id,
          ...updatedValues,
        };
      }),
    };
    partAsync.start(updateItem, changeRequest?.id, partToSave, partAsync);
  };

  const clearContent = () => {
    const copiedDataItem = find(data, { id: first(keys(copiedItems)) });
    const copiedDataItemField = copiedItems?.[copiedDataItem?.id ?? ''] ?? '';
    const updatedData = data.map(dataItem => {
      if (has(selectedState, dataItem.id) && !isEmpty(copiedDataItem)) {
        dataItem[copiedDataItemField] = EMPTY_DROPDOWN_PLACEHOLDER;
      }
      return dataItem;
    });
    updateMaterialDispositionTableData(null, updatedData);
    copyClipboardPopupMenu.close();
  };

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

      const updatedData = cloneDeep(data).map(dataItem => {
        if (has(selectedState, dataItem.id) && !isEmpty(copiedDataItem)) {
          dataItem[copiedDataItemField] = copiedDataItemValue;
        }
        !isConflictingSelections && (isConflictingSelections = hasConflictingSelections(dataItem));
        return dataItem;
      });

      if (isConflictingSelections) {
        onOpen();
        setIsCopyConflictedSelections(isConflictingSelections);
        seBulkDataToSubmit(updatedData);
        return;
      }

      if (formContext.isEditing) {
        formState?.setFieldValue(MATERIAL_DISPOSITION_TABLE_NAME, [...updatedData]);
        setData(updatedData);
        return;
      }
      updateMaterialDispositionTableData(null, updatedData);
    }
    copyClipboardPopupMenu.close();
  };

  const onConfirm = () => {
    if (formContext.isEditing) {
      updateUnsavedData(formik.values);
    } else if ((!isEmpty(copiedItems) || isCopyConflictedSelections) && !isEmpty(bulkDataToSubmit)) {
      updateMaterialDispositionTableData(null, bulkDataToSubmit);
    } else {
      updateMaterialDispositionTableData(formik.values, data);
    }
    dialog.close();
    setIsCopyConflictedSelections(false);
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
    resetForm({ values: editedMDItem ?? {} });
  }, [editedMDItem, setValues, resetForm]);

  useEffect(() => {
    const dataToSubmit = formState?.getFieldValue(MATERIAL_DISPOSITION_TABLE_NAME);
    if (formContext.isEditing && parentFormik.isSubmitting && !isEmpty(dataToSubmit)) {
      setDoNotPrompt?.(true);
      formState?.omitFieldValue(MATERIAL_DISPOSITION_TABLE_NAME);
      updateMaterialDispositionTableData(dataToSubmit, data);
    }
  }, [parentFormik.isSubmitting]);

  const copyClipboardPopupMenu = useDialog();

  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: editMDItem,
    onConfirm: submitForm,
    onDiscard: discardMDItem,
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
    const isUpdating = [Mode.edit].includes(item[MODE_FIELD]);

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
  }, []);

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
    <PopupClipboardMenuContext.Provider value={{ copyClipboardPopupMenu, selectedState, copiedItems, onUpdateSelectedCell, populateCopiedValue, clearContent }}>
      <ExcelExport ref={_export} fileName={EXCEL_FILE_NAME}>
        <KendoDataGrid<EditableMDItem>
          data={MDItemList}
          schema={getColumns()}
          fullWidth
          className={classes.rootMDTable}
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
          loading={materialDispositionAsync.isLoading || partAsync.isLoading}
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
    <AlertDialog
      dialog={dialog}
      message="approvalRequest.material.disposition.warning.alert"
      cancelAction={onClose}
      confirmAction={onConfirm} />
  </>);
};

export default FBMaterialDispositionTable;
