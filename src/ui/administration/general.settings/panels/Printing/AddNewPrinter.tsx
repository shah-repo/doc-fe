import { Grid } from '@material-ui/core';
import { FormikContextType, FormikProvider } from 'formik';
import { isEmpty } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { ZebraPrintSettings } from '../../../../../state/ducks/company/types';
import Dialog from '../../../../components/dialogs';
import { FormikField, TextField } from '../../../../components/forms/fields-next';
import PromptIfDirty from '../../../../components/forms/PromptIfDirty';
import useStyles from './styles';

interface AddNewPrinterProps {
  onCancel: () => void
  isOpened: boolean
  isFormDirty: boolean
  formik: FormikContextType<ZebraPrintSettings>
  onFormikFieldChange: React.FormEventHandler<HTMLDivElement>
}

const AddNewPrinter: React.FunctionComponent<AddNewPrinterProps> = ({
  onCancel,
  isOpened = false,
  formik,
  isFormDirty,
  onFormikFieldChange,
}) => {
  const classes = useStyles();
  return (
    <>
      <PromptIfDirty dirty={isFormDirty} isDialog doNotPrompt={!isOpened} onConfirm={onCancel} />
      <Dialog
        title={`${isEmpty(formik?.getFieldProps('apiKey')) ? translate('common.add') : translate('common.edit')} Printer`}
        confirmLabel={isEmpty(formik?.getFieldProps('apiKey')) ? 'common.add.printer' : 'common.save.changes'}
        cancelLabel="common.cancel"
        confirmProps={{
          'data-cy': 'label-print-save-changes-button',
        }}
        cancelProps={{
          'data-cy': 'label-print-cancel-button',
        }}
        open={isOpened}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onConfirm={formik?.handleSubmit}
        onCancel={onCancel}
        disableEnforceFocus
        disableBackdropClick
        scroll="paper"
        disableEscapeKeyDown
        onClose={onCancel}
        classes={{
          root: classes.root,
          paper: classes.paper,
        }}>
        <FormikProvider value={formik ?? {}}>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            spacing={2}>
            <Grid item xs={6}>
              <FormikField onChange={onFormikFieldChange}
                name="printer.name"
                required
                label="Name"
                error={!isEmpty(formik?.errors?.printer?.name)}>
                <TextField {...formik?.getFieldProps('printer.name')} />
              </FormikField>
            </Grid>
            <Grid item xs={6}>
              <FormikField onChange={onFormikFieldChange}
                name="printer.sn"
                required
                label="administration.general.settings.printing.printer.serial"
                error={!isEmpty(formik?.errors?.printer?.sn)}>
                <TextField {...formik?.getFieldProps('printer.sn')} />
              </FormikField>
            </Grid>
            <Grid item xs={12}>
              <FormikField onChange={onFormikFieldChange}
                name="apiKey"
                required
                label="administration.general.settings.printing.consumer.key"
                error={!isEmpty(formik?.errors.apiKey)}>
                <TextField {...formik?.getFieldProps('apiKey')} />
              </FormikField>
            </Grid>
            <Grid item xs={12}>
              <FormikField onChange={onFormikFieldChange}
                name="tenantId"
                required
                label="administration.general.settings.printing.tenant.id"
                error={!isEmpty(formik?.errors.tenantId)}>
                <TextField {...formik?.getFieldProps('tenantId')} />
              </FormikField>
            </Grid>
          </Grid>
        </FormikProvider>
      </Dialog>
    </>
  );
};

export default AddNewPrinter;
