import { useFormikContext } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { companySelectors } from '../../../../../state/ducks/company';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import TimezoneSelect from '../../../../components/TimezoneSelect';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';

const TimezoneSettings: React.FC<SettingsPanelProps> = (props) => {
  const companyTimezone = useSelector(companySelectors.getCompanyTimezone);
  const timezoneKey = 'timezone';
  const { setFieldValue } = useFormikContext<GeneralSettings>();

  const onChange = (value) => {
    setFieldValue(timezoneKey, value?.value);
  };

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.timezone.title')}>
      <TimezoneSelect value={companyTimezone} onChange={onChange} />
    </SettingsPanel>
  );
};

export default TimezoneSettings;
