import { DialogContent, Grid } from '@material-ui/core';
import { FormikContextType, FormikProvider } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import { ZebraPrintSettings } from '../../../../../state/ducks/company/types';
import Dialog from '../../../../components/dialogs';
import { FormField, TextField } from '../../../../components/forms/fields-next';

interface AddNewPrinterProps {
  onCancel: () => void
  isOpen: boolean
  formik: FormikContextType<ZebraPrintSettings>
}

const AddNewPrinter: React.FunctionComponent<AddNewPrinterProps> = ({
  onCancel,
  isOpen = false,
  formik,
}) => {
  return (
    <Dialog
      title={`${isEmpty(formik?.getFieldProps('apiKey')) ? 'Add' : 'Edit'} Printer`}
      confirmLabel={isEmpty(formik?.getFieldProps('apiKey')) ? 'common.add.printer' : 'common.save.changes'}
      cancelLabel="common.cancel"
      open={isOpen}
      onConfirm={formik?.handleSubmit}
      onCancel={onCancel}
      onClose={onCancel}>
      <DialogContent>
        <FormikProvider value={formik ?? {}}>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            spacing={2}>
            <Grid item xs={6}>
              <FormField label="Name">
                <TextField {...formik?.getFieldProps('printer.name')} />
              </FormField>
            </Grid>
            <Grid item xs={6}>
              <FormField label="administration.general.settings.printing.printer.serial">
                <TextField {...formik?.getFieldProps('printer.sn')} />
              </FormField>
            </Grid>
            <Grid item xs={12}>
              <FormField label="administration.general.settings.printing.consumer.key">
                <TextField {...formik?.getFieldProps('apiKey')} />
              </FormField>
            </Grid>
            <Grid item xs={12}>
              <FormField label="administration.general.settings.printing.tenant.id">
                <TextField {...formik?.getFieldProps('tenantId')} />
              </FormField>
            </Grid>
          </Grid>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewPrinter;
