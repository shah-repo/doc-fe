import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../common/intl';
import { ExpiredLotTypes, GeneralSettings } from '../../../../../state/ducks/company/types';
import SettingsPanel from '../../components/SettingsPanel';
import SwitchControl from '../../components/SwitchControl';
import { SettingsPanelProps } from '../../types';

const ExpiredLots: React.FC<SettingsPanelProps> = (props) => {
  const { getFieldProps, setFieldValue } = useFormikContext<GeneralSettings>();
  const expiredLotsKey = 'allocationConfig.expiredLotsSelectionPrompt';
  const isExpiredLotsAllowed = getFieldProps(expiredLotsKey).value === ExpiredLotTypes.WARNING;

  const handleExpiredLotChange = (event: ChangeEvent<{}>, checked: boolean) => {
    setFieldValue(expiredLotsKey, checked ? ExpiredLotTypes.WARNING : ExpiredLotTypes.ERROR);
  };

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.expired.lots')}>
      <SwitchControl
        {...getFieldProps('allocationConfig.expiredLotsSelectionPrompt')}
        checked={isExpiredLotsAllowed}
        onChange={handleExpiredLotChange}
        label={translate('administration.general.settings.expired.lots.label')}
      />
    </SettingsPanel>
  );
};

export default ExpiredLots;
