import React from 'react';
import { Autocomplete } from '../../../components/forms/fields-next';
import { SerialNumber, SerialNumberUsage, SerialsSelectOption } from '../../FBSerials/types';

interface Props {
  dataItem: SerialNumber
  options: Array<SerialsSelectOption<SerialNumberUsage>>
  onChange: (id: string, usage: SerialNumberUsage | null) => void
}

const StatusCell: React.FC<Props> = ({ dataItem, options, onChange }) => {
  const activeOption = options.find(option => option.value === dataItem.usage || (!option.value && !dataItem.usage));

  return (
    <Autocomplete
      options={options}
      size="small"
      disableClearable
      blurOnSelect
      filterSelectedOptions
      getOptionLabel={(option: SerialsSelectOption<SerialNumberUsage>) => option.value ? option.text : ''}
      value={activeOption}
      onChange={(e, value?: SerialsSelectOption<SerialNumberUsage>) => {
        if (!value) return;
        onChange(dataItem.id, value.value);
      }}
    />
  );
};

export default StatusCell;
