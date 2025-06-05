import React from 'react';
import { translate } from '../../../../../common/intl';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';
import TimezoneSelect from './components/TimezoneSelect';

const TimezoneSettings: React.FC<SettingsPanelProps> = (props) => {
  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.timezone.title')}>
      <TimezoneSelect {...props} />
    </SettingsPanel>
  );
};

export default TimezoneSettings;
