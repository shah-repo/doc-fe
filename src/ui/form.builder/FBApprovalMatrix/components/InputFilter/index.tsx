import React from 'react';
import { debounce } from 'lodash';
import { Input, InputChangeEvent } from '@progress/kendo-react-inputs';
import Filter from '../Filter';
import { GridFilterCellProps } from '@progress/kendo-react-grid';

const InputFilter: React.FC<GridFilterCellProps> = (props) => {
  const {
    value = '',
    operator = 'contains',
    onChange,
  } = props;

  const handleChange = debounce(
    (event: InputChangeEvent) => {
      const newValue = event.target.value;

      if (newValue === value) {
        return;
      }

      onChange({
        value: newValue,
        operator,
        syntheticEvent: event.syntheticEvent,
      });
    },
    500,
  );

  return (
    <Filter {...props}>
      <Input
        defaultValue={value}
        onChange={handleChange}
      />
    </Filter>
  );
};

export default InputFilter;
