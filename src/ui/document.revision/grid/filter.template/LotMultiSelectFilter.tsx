import { MultiSelectChangeEvent } from '@progress/kendo-react-dropdowns';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import FilterWrapper from '../../../components/common/kendo/FilterWrapper';
import CommonMultiSelect from '../../../components/common/kendo/MultiSelectFilter';

interface DropdownItem {
  text: string
  value: string | boolean
}

interface MultiSelectFilterCellProps extends GridFilterCellProps {
  data: DropdownItem[]
  customOperator?: string
  autoClose?: boolean
}

export const MultiLotSelectFilter = ({
  data,
  onChange,
  value,
  autoClose = false,
}: MultiSelectFilterCellProps): JSX.Element => {
  const [selectedValues, setSelectedValues] = React.useState<DropdownItem[]>([]);

  React.useEffect(() => {
    setSelectedValues(Array.isArray(value) ? data.filter((item) => value.includes(item.value)) : []);
  }, [value, data]);

  const onMultiSelectChange = ({ target, syntheticEvent }: MultiSelectChangeEvent) => {
    const selectedItems = target.value || [];

    setSelectedValues(selectedItems);

    onChange({
      value: selectedItems.map((item: DropdownItem) => item.value),
      operator: 'eq',
      syntheticEvent,
    });
  };

  const onClearButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    setSelectedValues([]);

    onChange({
      value: '',
      operator: '',
      syntheticEvent: event,
    });
  };

  return (
    <FilterWrapper hasValue={selectedValues.length > 0} onClear={onClearButtonClick}>
      <CommonMultiSelect
        data={data}
        textField="text"
        dataItemKey="value"
        value={selectedValues}
        onChange={onMultiSelectChange}
        autoClose={autoClose}
      />
    </FilterWrapper>
  );
};
