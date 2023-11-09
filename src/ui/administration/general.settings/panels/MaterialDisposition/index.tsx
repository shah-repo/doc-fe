import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import SettingsPanel from '../../components/SettingsPanel';
import SwitchControl from '../../components/SwitchControl';
import { SettingsPanelProps } from '../../types';

const MaterialDispositionSettings: React.FC<SettingsPanelProps> = (props) => {
  const { getFieldProps, values } = useFormikContext<GeneralSettings>();

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.md')}>
      <SwitchControl
        {...getFieldProps('shouldAutoUpdateLotStatus')}
        checked={values.shouldAutoUpdateLotStatus}
        label={translate('administration.general.settings.md.label')}
      />
    </SettingsPanel>
  );
};

export default MaterialDispositionSettings;
