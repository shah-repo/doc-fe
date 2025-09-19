import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { companySelectors } from '../../../../../state/ducks/company';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import TimezoneSelect from '../../../../components/TimezoneSelect';
import { TimezoneOption } from '../../../../components/TimezoneSelect/types';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';

const TimezoneSettings: React.FC<SettingsPanelProps> = (props) => {
  const defaultCompanyTimezone = useSelector(companySelectors.getCompanyTimezone);
  const [companyTimeZone, setCompanyTimeZone] = useState<string | undefined>();
  const { setFieldValue } = useFormikContext<GeneralSettings>();

  const onChange = (value: TimezoneOption | null) => {
    if (!value) {
      return;
    }

    const updatedTimezone = value?.value;
    setCompanyTimeZone(updatedTimezone);
    setFieldValue('timezone', updatedTimezone);
  };

  useEffect(() => {
    setCompanyTimeZone(defaultCompanyTimezone);
  }, [defaultCompanyTimezone]);

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.timezone.title')}>
      <TimezoneSelect value={companyTimeZone} onChange={onChange} />
    </SettingsPanel>
  );
};

export default TimezoneSettings;
