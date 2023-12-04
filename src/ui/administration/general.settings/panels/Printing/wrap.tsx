import { GridSelectionChangeEvent } from '@progress/kendo-react-grid';
import { useFormik, useFormikContext } from 'formik';
import { cloneDeep, isArray } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { GeneralSettings, ZebraPrintSettings } from '../../../../../state/ducks/company/types';
import useDialog from '../../../../hooks/useDialog';
import { SettingsPanelProps } from '../../types';

export const withLabelPrinting = <T extends SettingsPanelProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {
    const { getFieldProps, values: formValues } = useFormikContext();
    const PrintersData = getFieldProps('zebraPrint');
    const [isOpened, setIsOpened] = useState(false);
    const [dataResult, setDataResult] = React.useState(isArray(PrintersData?.value) ? PrintersData?.value : []);
    const [isEdit, setIsEdit] = React.useState({});
    const [deleteData, setDeleteData] = React.useState({});
    const [rowIndex, setRowIndex] = React.useState(0);
    const confirmationDialog = useDialog();
    const dispatch = useDispatch();
    const settingsId = useSelector(companySelectors.getGeneralSettingsId);

    useEffect(() => {
      setDataResult(isArray(PrintersData?.value) ? PrintersData?.value : []);
    }, [PrintersData?.value]);

    const formik = useFormik<ZebraPrintSettings>({
      initialValues: { apiKey: '', tenantId: '', printer: { isActive: true, name: '', sn: '' } },
      onSubmit: values => {
        if (isEdit) {
          const newDataResult = cloneDeep(dataResult);
          newDataResult[rowIndex] = values;
          formValues.zebraPrint = newDataResult;
          dispatch(companyActions.updateGeneralSettings(formValues, settingsId, 'PUT'));
        } else {
          values.printer.isActive = true;
          const newData = cloneDeep(dataResult);
          newData.push(values);
          formValues.zebraPrint = newData;
          dispatch(companyActions.updateGeneralSettings(formValues));
        }
        setIsOpened(false);
      },
    });

    const { setValues, resetForm, dirty } = formik;
    const [isFormDirty, setIsFormDirty] = useState(dirty);
    const onAddNew = () => {
      setIsEdit(false);
      resetForm();
      setIsOpened(true);
    };

    const onEdit = (editData: ZebraPrintSettings, rowIndex: number) => {
      setIsEdit(true);
      setValues(editData);
      setIsOpened(true);
      setRowIndex(rowIndex);
      setIsFormDirty(false);
    };

    const onDelete = (data: ZebraPrintSettings) => {
      confirmationDialog.open();
      setDeleteData(data);
    };

    const confirmDeletePrinter = () => {
      const newData = dataResult.filter(item => item.apiKey !== deleteData.apiKey);
      const fValues: GeneralSettings = cloneDeep(formValues);
      fValues.zebraPrint = newData;
      dispatch(companyActions.updateGeneralSettings(fValues, settingsId, 'PUT'));
      confirmationDialog.close();
    };

    const cancelDeletePrinter = () => {
      confirmationDialog.close();
    };

    const onCancel = () => {
      setIsEdit(false);
      setIsOpened(false);
    };

    const onSelectionChange = (event: GridSelectionChangeEvent) => {
      if (event?.dataItem) {
        const { dataItem, dataItems } = event;
        dataItems.map(item => {
          if (item.apiKey === dataItem.apiKey) {
            item.printer.isActive = !item.printer.isActive;
          }
          return item;
        });
        setDataResult(dataItems);
        const fValues: GeneralSettings = cloneDeep(formValues);
        fValues.zebraPrint = dataItems;
        dispatch(companyActions.updateGeneralSettings(fValues, settingsId, 'PUT'));
      }
    };

    const onFormikFieldChange = () => {
      setIsFormDirty(true);
    };

    return Component({
      ...(props),
      onAddNew,
      onEdit,
      onCancel,
      onSelectionChange,
      onDelete,
      dataResult,
      isOpened,
      formik,
      isFormDirty,
      confirmationDialog,
      confirmDeletePrinter,
      cancelDeletePrinter,
      onFormikFieldChange,
    });
  };

  return (props: T) => Comp(props);
};
