import { DropDownList, DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import React from 'react';
import Filter from '../Filter';
import { DATA_ITEM_KEY, TEXT_FIELD } from '../Grid';
import { DropdownFilterCellProps } from './types';

const DropdownFilter: React.FC<DropdownFilterCellProps> = (props) => {
  const {
    data,
    value,
    operator = 'eq',
    children,
    defaultItem,
    defaultValue,
    onChange,
    disabled,
  } = props;

  const handleChange = (event: DropDownListChangeEvent) => {
    const newValue = event.target.value[DATA_ITEM_KEY];

    if (newValue === value) {
      return;
    }

    onChange({
      value: newValue,
      operator,
      syntheticEvent: event.syntheticEvent,
    });
  };

  return (
    <Filter {...props}>
      <DropDownList
        data={data}
        textField={TEXT_FIELD}
        dataItemKey={DATA_ITEM_KEY}
        onChange={handleChange}
        defaultItem={defaultItem}
        defaultValue={defaultValue}
        value={data.find((item) => item[DATA_ITEM_KEY] === value) ?? defaultItem}
        disabled={disabled}
      />
      {children}
    </Filter>
  );
};

export default DropdownFilter;
