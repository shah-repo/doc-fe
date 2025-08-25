import { useFormikContext } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import TimezoneSelect from '../../../../components/TimezoneSelect';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';

const TimezoneSettings: React.FC<SettingsPanelProps> = (props) => {
  const dispatch = useDispatch();
  const companyTimezone = useSelector(companySelectors.getCompanyTimezone);
  const { values } = useFormikContext<GeneralSettings>();

  const onChange = (value) => {
    dispatch(companyActions.updateGeneralSettings({ ...values, timezone: value?.value }));
  };

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.timezone.title')}>
      <TimezoneSelect value={companyTimezone} onChange={onChange} />
    </SettingsPanel>
  );
};

export default TimezoneSettings;
