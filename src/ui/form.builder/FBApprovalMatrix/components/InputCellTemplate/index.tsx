import React from 'react';
import { get, set, debounce } from 'lodash';
import { Input, InputProps } from '@progress/kendo-react-inputs';
import { MODE_FIELD, Mode } from '../Grid';
import { CellTemplate } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

const InputCellTemplate: CellTemplate = (props) => {
  const { dataItem, field, dataIndex, column, onChange } = props;
  const { title, editable } = column;

  const mode = get(dataItem, MODE_FIELD);
  const path = field ?? '';
  const value = String(get(dataItem, path) ?? '');

  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  const handleChange: InputProps['onChange'] = debounce(
    (event) => {
      onChange?.({
        dataIndex,
        dataItem: set(dataItem as Record<string, unknown>, path, event.value),
        syntheticEvent: event.syntheticEvent,
        field,
        value: event.value,
      });
    },
    500,
  );

  if (!canBeModified) {
    return value || '-';
  }

  return (
    <Input
      placeholder={title}
      defaultValue={value}
      onChange={handleChange}
    />
  );
};

export default InputCellTemplate;
