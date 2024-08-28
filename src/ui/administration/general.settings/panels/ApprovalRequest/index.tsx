import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import SettingsPanel from '../../components/SettingsPanel';
import SwitchControl from '../../components/SwitchControl';
import { SettingsPanelProps } from '../../types';

const ApprovalRequestsSettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, values } = useFormikContext<GeneralSettings>();

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.ar')}>
      <SwitchControl
        {...getFieldProps('approvalRequestAdmin')}
        checked={values.approvalRequestAdmin}
        label={translate('administration.general.settings.ar.allow.edit')}
      />
    </SettingsPanel>
  );
};

export default ApprovalRequestsSettingsPanel;
