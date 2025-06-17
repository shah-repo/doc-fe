import { find } from 'lodash';
import moment from 'moment-timezone';
import React, { useMemo } from 'react';
import { translate } from '../../../common/intl';
import { Autocomplete } from '../forms/fields-next';
import { TimezoneOption, TimezoneSelectProps } from './types';

const generateTimezoneOptions = (): TimezoneOption[] => {
  return moment.tz.names().map((tz) => {
    const now = moment().tz(tz);
    const offsetInMinutes = now.utcOffset();
    const offsetHours = Math.floor(offsetInMinutes / 60);
    const offsetMinutes = Math.abs(offsetInMinutes % 60);

    const offsetFormatted = `GMT${offsetInMinutes >= 0 ? '+' : '-'}${String(Math.abs(offsetHours)).padStart(
      2,
      '0',
    )}:${String(offsetMinutes).padStart(2, '0')}`;

    return {
      value: tz,
      label: `(${offsetFormatted}) ${tz.replace(/_/g, ' ')}`,
      offset: offsetInMinutes / 60,
      abbrev: now.zoneAbbr(),
      altName: now.zoneName(),
    };
  });
};

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
      getOptionLabel={(option) => option.label}
      placeholder={placeholder}
      value={timezone}
      onChange={(_, selectedOption) => onChange(selectedOption)}
      autoHighlight
      clearOnEscape
      disabled={disabled}
    />
  );
};

export default TimezoneSelect;
