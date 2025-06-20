import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { translate } from '../../../../../common/intl';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import TimezoneSelect from '../../../../components/TimezoneSelect';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import SettingsPanel from '../../components/SettingsPanel';
import { SettingsPanelProps } from '../../types';

const TimezoneSettings: React.FC<SettingsPanelProps> = (props) => {
  const dispatch = useDispatch();
  const updateCompanyTimezone = useActionCreator(companyActions.updateCompanyTimezone);
  const companyTimezone = useSelector(companySelectors.getCompanyTimezone);

  const asyncCompanyTimezone = useAsync({
    onSuccess: (data: any) => {
      if (data?.affected) {
        dispatch(companyActions.getGeneralSettings());
      }
    },
  });

  const onChange = (value) => {
    asyncCompanyTimezone.start(updateCompanyTimezone, { timezone: value?.value }, asyncCompanyTimezone);
  };

  return (
    <SettingsPanel {...props} title={translate('administration.general.settings.timezone.title')}>
      <TimezoneSelect value={companyTimezone} onChange={onChange} />
    </SettingsPanel>
  );
};

export default TimezoneSettings;
