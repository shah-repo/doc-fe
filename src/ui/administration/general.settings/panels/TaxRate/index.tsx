import { InputAdornment, makeStyles } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import { FormikField, TextField } from '../../../../components/forms/fields-next';
import { DEFAULT_TAX_RATE } from '../../../../form.builder/helpers/constants';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';

const FIELD = 'defaultTaxRate';
const INPUT_WIDTH = 180;

const useStyles = makeStyles({
  input: {
    maxWidth: INPUT_WIDTH,
  },
});

const TaxRateSettings: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, setFieldValue } = useFormikContext<GeneralSettings>();

  const classes = useStyles();

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFieldValue(FIELD, value === '' ? null : Number(value));
  };

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.tax.rate')}>
      <FormikField
        name={FIELD}
        label="administration.general.settings.tax.rate.label"
        helperText="administration.general.settings.tax.rate.info"
      >
        <TextField
          type="number"
          {...getFieldProps(FIELD)}
          onChange={updateValue}
          inputProps={{ min: 0, max: 100, step: 0.01 }}
          endAdornment={<InputAdornment position="end">%</InputAdornment>}
          placeholder={translate('form.builder.tax.rate.editor.placeholder', { value: DEFAULT_TAX_RATE })}
          className={classes.input}
        />
      </FormikField>

    </SettingsPanel>
  );
};

export default TaxRateSettings;
