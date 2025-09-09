import { find, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../common/intl';
import { timezoneActions } from '../../../state/ducks/timezoneSelect';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { Autocomplete } from '../forms/fields-next';
import { toastError } from '../notifications';
import { TimezoneOption, TimezoneResponseBody, TimezoneSelectProps } from './types';

const TimezoneSelect: React.FC<TimezoneSelectProps> = ({
  value,
  onChange,
  placeholder = translate('common.select'),
  disabled = false,
}) => {
  const [timezoneOptions, setTimezoneOptions] = useState<TimezoneOption[]>();
  const timezone = find(timezoneOptions, { value });
  const fetchTimezonesList = useActionCreator(timezoneActions.fetchTimezonesList);

  const prepareTimzoneOptions = (timezoneOptions: TimezoneResponseBody[]) => timezoneOptions.map(timzone => ({
    value: timzone?.name ?? '',
    label: `(GMT${timzone?.utcOffset}) ${timzone?.name.replace(/_/g, ' ')}`,
    offset: timzone?.utcOffset ?? '',
    abbrev: timzone?.abbreviation ?? '',
    altName: timzone?.abbreviation ?? '',
  }));

  const timzoneAsync = useAsync<TimezoneResponseBody[]>({
    onSuccess: (data: TimezoneResponseBody[] | undefined) => {
      setTimezoneOptions(prepareTimzoneOptions(data ?? []));
    },
    onError: toastError,
  });

  const loadTimezonesList = () => {
    timzoneAsync.start(fetchTimezonesList, timzoneAsync);
  };

  useEffect(() => {
    loadTimezonesList();
  }, []);

  return (
    <Autocomplete
      options={timezoneOptions}
      getOptionLabel={(option: TimezoneOption) => option.label}
      placeholder={placeholder}
      key={isEmpty(timezoneOptions) ? 'disable' : 'enable'}
      value={timezone}
      onChange={(_, selectedOption) => onChange(selectedOption)}
      autoHighlight
      clearOnEscape
      disabled={disabled}
      disableClearable
    />
  );
};

export default TimezoneSelect;
