import { useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../common/intl';
import { GeneralSettings } from '../../../../state/ducks/company/types';
import SettingsPanel from '../components/SettingsPanel';
import SwitchControl from '../components/SwitchControl';

interface Props {
  expanded: boolean
  onToggle: () => void
}

const ApprovalRequestsSettingsPanel: React.FC<Props> = (props) => {
  const { getFieldProps, values } = useFormikContext<GeneralSettings>();

  return (
    <SettingsPanel title={translate('administration.general.settings.ar')} {...props}>
      <SwitchControl
        label={translate('administration.general.settings.ar.allow.edit')}
        {...getFieldProps('approvalRequestAdmin')}
        checked={values.approvalRequestAdmin}
      />
    </SettingsPanel>
  );
};

export default ApprovalRequestsSettingsPanel;
