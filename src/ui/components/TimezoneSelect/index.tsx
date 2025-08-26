import { find } from 'lodash';
import moment from 'moment-timezone';
import React, { useMemo } from 'react';
import { translate } from '../../../common/intl';
import { Autocomplete } from '../forms/fields-next';
import { TimezoneOption, TimezoneSelectProps } from './types';

const generateTimezoneOptions = (): TimezoneOption[] => moment.tz.names().map((tz) => {
  const now = moment().tz(tz);

  return {
    value: tz,
    label: `(GMT${moment.tz(now, tz).format('Z')}) ${tz.replace(/_/g, ' ')}`,
    offset: now.utcOffset(),
    abbrev: now.zoneAbbr(),
    altName: now.zoneName(),
  };
});

const TimezoneSelect: React.FC<TimezoneSelectProps> = ({
  value,
  onChange,
  placeholder = translate('common.select'),
  disabled = false,
}) => {
  const timezoneOptions = useMemo(() => generateTimezoneOptions(), []);
  const timezone = find(timezoneOptions, { value });

  return (
    <Autocomplete
      options={timezoneOptions}
      getOptionLabel={(option: TimezoneOption) => option.label}
      placeholder={placeholder}
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
