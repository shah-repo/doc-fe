import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Typography } from '@material-ui/core';
import { ExcelExport, ExcelExportColumnProps } from '@progress/kendo-react-excel-export';
import { GridToolbar } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { isEmpty, map, omit, pick } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { getFormattedDateString, MomentFormats } from '../../../../../common/utils/date';
import { ChangeRequest, ChangeRequestStatus } from '../../../../../state/ducks/changeRequest/types';
import { companySelectors } from '../../../../../state/ducks/company';
import { materialDispositionActions } from '../../../../../state/ducks/materialDisposition';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import { useFormContext } from '../../../../components/forms/FormContext';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition, DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import { StyleTooltip } from '../../../../dashboard.new/line.items/common/StyleTooltip';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import { changeRequestPreviewPath } from '../../../utils/paths';
import ColumnShowHideMDMenu from './components/ColumnShowHideMDMenu';
import { DROPDOWN_FIELDS, EMPTY_DROPDOWN_PLACEHOLDER, EXCEL_FILE_NAME, FIELDS_TO_PICK } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableMDItem, MaterialDispositionItem, MDItemEditEvent } from './types';
import { getExcelColumns } from './utils';

interface props {
  changeRequest?: ChangeRequest
  isShowOnly?: boolean
  setDoNotPrompt?: (state: boolean) => void
}

const FBMaterialDispositionTable: React.FunctionComponent<props> = ({ changeRequest, isShowOnly, setDoNotPrompt }) => {
  const classes = useStyles();
  const [editedMDItem, setEditedMDItem] = React.useState<EditableMDItem>();
  const isEditMode = React.useRef<boolean>(false);
  const [data, setData] = React.useState<EditableMDItem[]>([]);
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<Date>();
  const settings = useSelector(companySelectors.getGeneralSettings);

  const editMDItem = ({ dataItem }: MDItemEditEvent) => {
    if (isShowOnly || formik.dirty || isEditMode.current) {
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
  const discardMDItem = () => setEditedMDItem(undefined);
  const getColumns = () => {
    return columns.filter(({ show }) => show);
  };
  const dialog = useDialog();
  const formContext = useFormContext();
  const parentFormik = useFormikContext();
  const [dataToSubmit, setDataToSubmit] = React.useState<Partial<EditableMDItem>>({});
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
    onSuccess: (response) => {
      if (response?.affected > 0) {
        materialDispositionAsync.start(load, changeRequest?.id, materialDispositionAsync);
        if (formContext.isEditing) {
          history.push(changeRequestPreviewPath(changeRequest?.id ?? ''));
        }
      }
    },
    onError: toastError,
  });

  const fetchMaterialDispositionTableData = () => {
    changeRequest?.id && materialDispositionAsync.start(load, changeRequest.id, materialDispositionAsync);
  };

  useEffect(() => {
    fetchMaterialDispositionTableData();
  }, []);

  const updateUnsavedData = (values: Partial<EditableMDItem>) => {
    isEditMode.current = true;
    setDataToSubmit(values);
    setData(prev => {
      return prev.map(item => {
        if (item.id === values.id) {
          return {
            ...(values as EditableMDItem),
          };
        }
        return item;
      });
    });
  };

  const formik = useFormik<Partial<EditableMDItem>>({
    initialValues: {},
    onSubmit: (values) => {
      const count = DROPDOWN_FIELDS.reduce((count, fieldName) => {
        if (values[fieldName] !== EMPTY_DROPDOWN_PLACEHOLDER) {
          return count + 1;
        }
        return count;
      }, 0);

      if (count > 1 && settings?.shouldAutoUpdateLotStatus) {
        onOpen();
      } else {
        if (formContext.isEditing) {
          updateUnsavedData(values);
        } else {
          updateMaterialDispositionTableData(values);
        }
        discardMDItem();
      }
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  const updateMaterialDispositionTableData = (values: Partial<EditableMDItem>) => {
    const partToSave = pick(values, FIELDS_TO_PICK);
    partAsync.start(updateItem, changeRequest?.id, values.id, partToSave, partAsync);
  };

  const onConfirm = () => {
    if (formContext.isEditing) {
      updateUnsavedData(formik.values);
    } else {
      updateMaterialDispositionTableData(formik.values);
    }
    dialog.close();
    discardMDItem();
  };

  const onOpen = () => {
    dialog.open();
  };

  useEffect(() => {
    resetForm({ values: editedMDItem ?? {} });
  }, [editedMDItem, setValues, resetForm]);

  useEffect(() => {
    if (formContext?.isEditing && parentFormik?.isSubmitting && !isEmpty(dataToSubmit)) {
      setDoNotPrompt?.(true);
      updateMaterialDispositionTableData(dataToSubmit);
    }
  }, [parentFormik?.isSubmitting]);

  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: editMDItem,
    onConfirm: submitForm,
    onDiscard: discardMDItem,
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
    const isMDItemEdited = editedMDItem && editedMDItem.id === item.id;

    return [
      ...list,
      {
        ...(isMDItemEdited ? editedMDItem : item),
        lotDocId: item.lotDocId ?? EMPTY_DROPDOWN_PLACEHOLDER,
        [MODE_FIELD]: isMDItemEdited ? Mode.edit : Mode.show,
      },
    ];
  }, []);

  const _export = React.useRef<ExcelExport | null>(null);
  const exportToExcel = () => {
    if (_export.current !== null) {
      _export.current.save(MDItemList, getExcelColumns(getColumns()) as ExcelExportColumnProps[]);
    }
  };

  return (<>
    <ExcelExport ref={_export} fileName={EXCEL_FILE_NAME}>
      <KendoDataGrid<EditableMDItem>
        data={MDItemList}
        schema={getColumns()}
        fullWidth
        className={classes.rootMDTable}
        hasBoxScrollbars
        onRowClick={editMDItem}
        rowRender={rowRender}
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
    <AlertDialog dialog={dialog}
      message="approvalRequest.material.disposition.warning.alert"
      confirmAction={onConfirm} />
  </>);
};

export default FBMaterialDispositionTable;
