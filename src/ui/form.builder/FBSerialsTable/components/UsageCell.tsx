import React from 'react';
import { Autocomplete } from '../../../components/forms/fields-next';
import { SerialNumber, SerialNumberStatus, SerialNumberUsage, SerialsSelectOption } from '../../FBSerials/types';

interface Props {
  dataItem: SerialNumber
  options: Array<SerialsSelectOption<SerialNumberUsage>>
  onChange: (id: string, usage: SerialNumberUsage | null) => void
}

const StatusCell: React.FC<Props> = ({ dataItem, options, onChange }) => {
  const activeOption = options.find(option => option.value === dataItem.usage || (!option.value && !dataItem.usage));

  const isDisabled = dataItem.status !== SerialNumberStatus.REJECTED;

  return (
    <Autocomplete
      options={options}
      size="small"
      disabled={isDisabled}
      disableClearable
      blurOnSelect
      filterSelectedOptions
      getOptionLabel={(option: SerialsSelectOption<SerialNumberUsage>) => option.value ? option.text : ''}
      renderOption={(option: SerialsSelectOption<SerialNumberUsage>) => option.text}
      value={isDisabled ? null : activeOption}
      onChange={(e, value?: SerialsSelectOption<SerialNumberUsage>) => {
        if (!value) return;
        onChange(dataItem.id, value.value);
      }}
    />
  );
};

export default StatusCell;
