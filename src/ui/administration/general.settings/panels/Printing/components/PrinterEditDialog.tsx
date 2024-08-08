import { Grid } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import Dialog from '../../../../../components/dialogs';
import { DialogProps } from '../../../../../components/dialogs/Dialog.types';
import { FormikField, TextField } from '../../../../../components/forms/fields-next';

interface Props extends DialogProps {}

const PrinterEditDialog: React.FC<Props> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();
  return (
    <Dialog
      {...props}
      confirmProps={{
        ...props.confirmProps,
        'data-cy': 'label-print-save-changes-button',
      }}
      cancelProps={{
        ...props.cancelProps,
        'data-cy': 'label-print-cancel-button',
      }}
    >
      <Grid
        container
        alignItems="flex-start"
        justify="space-between"
        spacing={2}
      >
        <Grid item xs={6}>
          <FormikField
            required
            name="printer.name"
            label="common.name"
          >
            <TextField {...getFieldProps('printer.name')} />
          </FormikField>
        </Grid>
        <Grid item xs={6}>
          <FormikField
            required
            name="printer.sn"
            label="administration.general.settings.printing.printer.serial"
          >
            <TextField {...getFieldProps('printer.sn')} />
          </FormikField>
        </Grid>
        <Grid item xs={12}>
          <FormikField
            required
            name="apiKey"
            label="administration.general.settings.printing.consumer.key"
          >
            <TextField {...getFieldProps('apiKey')} />
          </FormikField>
        </Grid>
        <Grid item xs={12}>
          <FormikField
            required
            name="tenantId"
            label="administration.general.settings.printing.tenant.id"
          >
            <TextField {...getFieldProps('tenantId')} />
          </FormikField>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default PrinterEditDialog;
