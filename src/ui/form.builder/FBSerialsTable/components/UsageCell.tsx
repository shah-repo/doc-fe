import React from 'react';
import { Autocomplete } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../components/KendoDataGrid/constants';
import { SerialNumberStatus, SerialNumberUsage, SerialsSelectOption } from '../../FBSerials/types';
import { TableCellProps } from '../types';

interface Props extends TableCellProps {
  options: Array<SerialsSelectOption<SerialNumberUsage>>
  onChange: (id: string, usage: SerialNumberUsage | null) => void
}

const UsageCell: React.FC<Props> = ({
  isTableDisabled,
  dataItem,
  options,
  onChange,
}) => {
  const activeOption = options.find(option => option.value === dataItem.usage || (!option.value && !dataItem.usage));
  const isRejected = dataItem.status === SerialNumberStatus.REJECTED;
  const isDisabled = !isRejected || dataItem.isDisabled;

  if (isTableDisabled) {
    return <>{activeOption?.value && isRejected ? activeOption.text : EMPTY_VALUE_PLACEHOLDER}</>;
  }

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
      value={!isRejected ? null : activeOption}
      onChange={(e, value?: SerialsSelectOption<SerialNumberUsage>) => {
        if (!value) return;
        onChange(dataItem.id, value.value);
      }}
    />
  );
};

export default UsageCell;
