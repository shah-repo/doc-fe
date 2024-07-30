/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { omit } from 'lodash';
import React, { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { GeneralSettings, ZebraPrintSettings } from '../../../../../state/ducks/company/types';
import { AlertDialog } from '../../../../components/dialogs';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsTable from '../../components/SettingsTable';
import { SettingsPanelProps } from '../../types';
import PrinterEditDialog from './components/PrinterEditDialog';
import { buildSchema } from './schema';
import { EditablePrinter } from './types';

const PANEL_FIELD = 'zebraPrint';

const INITIAL_VALUES = {
  _id: '',
  [MODE_FIELD]: Mode.add,
  active: true,
  tenantId: '',
  apiKey: '',
  printer: {
    isActive: true,
    name: '',
    sn: '',
    labelTemplates: [],
  },
};

const PrintingSettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, values: formValues } = useFormikContext<GeneralSettings>();
  const printersList = getFieldProps<ZebraPrintSettings[]>(PANEL_FIELD).value;
  const settingsId = useSelector(companySelectors.getGeneralSettingsId);
  const printerToDelete = useRef<EditablePrinter>();

  const editDialog = useDialog();
  const deleteConfirmationDialog = useDialog();

  const async = useAsync({ onError: toastError });
  const updatePrinterSettings = useActionCreator(companyActions.updateGeneralSettings);

  const data = useMemo(
    () => printersList.map(printer => ({
      ...printer,
      _id: uuidv4(),
      [MODE_FIELD]: Mode.show,
      active: printer.printer.isActive,
    })),
    [printersList],
  );

  const formik = useFormik<EditablePrinter>({
    initialValues: INITIAL_VALUES,
    onSubmit: (values) => {
      const isAdding = values[MODE_FIELD] === Mode.add;
      const updatedPrinters = isAdding
        ? [...data, values]
        : data.map(printer => printer._id === values._id ? values : printer);
      const updatedValues = {
        ...formValues,
        [PANEL_FIELD]: updatedPrinters.map(printer => omit(printer, MODE_FIELD, '_id', 'active')),
      };
      async.start(updatePrinterSettings, updatedValues, settingsId, 'PUT', async);
      editDialog.close();
    },
  });

  const addNewPrinter = () => {
    formik.resetForm();
    editDialog.open();
  };

  const editPrinter = (printer: EditablePrinter) => {
    formik.setValues({
      ...printer,
      [MODE_FIELD]: Mode.edit,
    });
    editDialog.open();
  };

  const discardEdit = () => {
    formik.resetForm();
    editDialog.close();
  };

  const confirmPrinterDeletion = (printer: EditablePrinter) => {
    printerToDelete.current = printer;
    deleteConfirmationDialog.open();
  };

  const deletePrinter = () => {
    deleteConfirmationDialog.close();

    if (!printerToDelete.current) {
      return;
    }

    const updatedPrinters = data.reduce<EditablePrinter[]>(
      (list, printer) => printer._id === printerToDelete.current?._id ? list : [...list, printer],
      [],
    );
    const updatedValues = {
      ...formValues,
      [PANEL_FIELD]: updatedPrinters.map(printer => omit(printer, MODE_FIELD, '_id', 'active')),
    };
    async.start(updatePrinterSettings, updatedValues, settingsId, 'PUT', async);
  };

  const discardDelete = () => {
    printerToDelete.current = undefined;
    deleteConfirmationDialog.close();
  };

  const savePrinter = async () => {
    await formik.submitForm();
  };

  const schema = buildSchema({
    isActive: true,
    onEdit: editPrinter,
    onDelete: confirmPrinterDeletion,
    onDiscard: discardEdit,
    onConfirm: savePrinter,
  });

  const isEditMode = formik.values._mode === Mode.edit;

  return (
    <>
      <SettingsPanel
        {...props}
        title={translate('administration.general.settings.printing')}
        onAddNew={addNewPrinter}
      >
        <SettingsTable
          isActive
          data={data}
          schema={schema}
        />
      </SettingsPanel>
      <AlertDialog
        handler={deleteConfirmationDialog}
        onConfirm={deletePrinter}
        onCancel={discardDelete}
      >
        {translate('printer.delete.alert')}
      </AlertDialog>
      <FormikProvider value={formik}>
        <PrinterEditDialog
          disableBackdropClick
          title={isEditMode ? 'common.edit.printer' : 'common.add.printer'}
          confirmLabel={isEditMode ? 'common.save.changes' : 'common.add.printer'}
          cancelLabel="common.cancel"
          open={editDialog.isOpen}
          onClose={discardEdit}
          onCancel={discardEdit}
          onConfirm={savePrinter}
        />
      </FormikProvider>
    </>
  );
};

export default PrintingSettingsPanel;
