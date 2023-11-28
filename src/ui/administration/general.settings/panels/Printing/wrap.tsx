import { GridSelectionChangeEvent } from '@progress/kendo-react-grid';
import { useFormik, useFormikContext } from 'formik';
import { cloneDeep, isArray, isEmpty } from 'lodash';
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
    const [isOpen, setIsOpen] = useState(false);
    const [dataResult, setDataResult] = React.useState(isArray(PrintersData?.value) ? PrintersData?.value : []);
    const [editData, setEditData] = React.useState({});
    const [deleteData, setDeleteData] = React.useState({});
    const confirmationDialog = useDialog();
    const dispatch = useDispatch();
    const settingsId = useSelector(companySelectors.getGeneralSettingsId);

    useEffect(() => {
      setDataResult(isArray(PrintersData?.value) ? PrintersData?.value : []);
    }, [PrintersData?.value]);

    const formik = useFormik<ZebraPrintSettings>({
      initialValues: { apiKey: '', tenantId: '', printer: { isActive: true, name: '', sn: '' } },
      onSubmit: values => {
        if (!isEmpty(editData)) {
          const index = dataResult.findIndex(item => item.apiKey === values.apiKey);
          const newDataResult = cloneDeep(dataResult);
          newDataResult[index] = values;
          const fValues: GeneralSettings = cloneDeep(formValues);
          fValues.zebraPrint = newDataResult;
          dispatch(companyActions.updateGeneralSettings(fValues, settingsId, 'PUT'));
        } else {
          values.printer.isActive = true;
          const newData = cloneDeep(dataResult);
          newData.push(values);
          formValues.zebraPrint = newData;
          dispatch(companyActions.updateGeneralSettings(formValues));
        }
        setIsOpen(false);
      },
    });

    const { setValues, resetForm } = formik;
    const onAddNew = (editData: ZebraPrintSettings) => {
      if (editData) {
        setEditData(editData);
        setValues(editData);
      } else {
        resetForm();
        setEditData(editData);
      }
      setIsOpen(true);
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
      setEditData({});
      setIsOpen(false);
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

    return Component({
      ...(props),
      onAddNew,
      onCancel,
      onSelectionChange,
      onDelete,
      dataResult,
      isOpen,
      editData,
      formik,
      confirmationDialog,
      confirmDeletePrinter,
      cancelDeletePrinter,
    });
  };

  return (props: T) => Comp(props);
};
