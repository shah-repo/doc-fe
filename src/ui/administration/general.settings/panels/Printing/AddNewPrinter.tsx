import { DialogContent, Grid } from '@material-ui/core';
import { FormikProvider } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import Dialog from '../../../../components/dialogs';
import { FormField, TextField } from '../../../../components/forms/fields-next';
import { SettingsPanelProps } from '../../types';

const AddNewPrinter: React.FunctionComponent<SettingsPanelProps> = ({
  onCancel,
  isOpen = false,
  editData,
  formik,
}) => {
  return (
    <Dialog
      title={`${isEmpty(editData) ? 'Add' : 'Edit'} Printer`}
      confirmLabel={isEmpty(editData) ? 'common.add.printer' : 'common.save.changes'}
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
