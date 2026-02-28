import { InputAdornment } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import { FormikField, TextField } from '../../../../components/forms/fields-next';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';

const FIELD = 'defaultTaxRate';

const PurchaseOrdersSettings: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext<GeneralSettings>();

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.purchase.orders')}>
      <FormikField
        name={FIELD}
        label="administration.general.settings.purchase.orders.tax.rate.label"
        helperText="administration.general.settings.purchase.orders.tax.rate.info"
      >
        <TextField
          type="number"
          {...getFieldProps(FIELD)}
          inputProps={{ min: 0, step: 0.01 }}
          endAdornment={<InputAdornment position="end">%</InputAdornment>}
        />
      </FormikField>

    </SettingsPanel>
  );
};

export default PurchaseOrdersSettings;
