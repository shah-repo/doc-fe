import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../common/intl';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import SettingsPanel from '../components/SettingsPanel';
import SettingsPanelSection from '../components/SettingsPanelSection';
import { SettingsPanelProps } from '../types';

const PrintingSettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  const { getFieldProps } = useFormikContext();

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.printing')}>
      <SettingsPanelSection>{translate('administration.general.settings.printing.title')}</SettingsPanelSection>
      <FormikField
        name="zebraPrint.apiKey"
        label="administration.general.settings.printing.consumer.key"
        margin="normal"
      >
        <TextField
          {...getFieldProps('zebraPrint.apiKey')}
        />
      </FormikField>
      <FormikField
        name="zebraPrint.tenantId"
        label="administration.general.settings.printing.tenant.id"
        margin="normal"
      >
        <TextField
          {...getFieldProps('zebraPrint.tenantId')}
        />
      </FormikField>
      <FormikField
        name="zebraPrint.printers[0].sn"
        label="administration.general.settings.printing.printer.serial"
      >
        <TextField
          {...getFieldProps('zebraPrint.printers[0].sn')}
        />
      </FormikField>
    </SettingsPanel>
  );
};

export default PrintingSettingsPanel;
