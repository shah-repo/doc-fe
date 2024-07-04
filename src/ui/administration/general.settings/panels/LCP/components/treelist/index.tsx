import React from 'react';
import { translate } from '../../../../../../../common/intl';
import { withThemeNext } from '../../../../../../layout/theme-next';
import SettingsPanel from '../../../../components/SettingsPanel';
import { SettingsPanelProps } from '../../../../types';

const LCPGrid: React.FC<SettingsPanelProps> = (props) => {
  const onAddNew = () => {
    console.log('clicked');
  };

  return <SettingsPanel {...props} title={translate('administration.general.settings.lcp')} onAddNew={onAddNew}>
    <span>Table</span>
  </SettingsPanel>;
};

export default React.memo(withThemeNext(React.forwardRef(LCPGrid)));
