import React, { useState } from 'react';
import { translate } from '../../../../../common/intl';
import TimezoneSelect from '../../../../components/TimezoneSelect';
import { TimezoneOption } from '../../../../components/TimezoneSelect/types';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';

const TimezoneSettings: React.FC<SettingsPanelProps> = (props) => {
  const [timezone, setTimezone] = useState<TimezoneOption | null>(null);

  const onChange = (value) => {
    console.log('Selected zone', value);
    setTimezone(value);
    // TODO API
  };

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.timezone.title')}>
      <TimezoneSelect value={timezone?.value} onChange={onChange} />
    </SettingsPanel>
  );
};

export default TimezoneSettings;
