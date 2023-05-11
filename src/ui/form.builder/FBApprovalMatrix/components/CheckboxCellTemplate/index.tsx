import React from 'react';
import { get, set } from 'lodash';
import { Checkbox, CheckboxProps } from '@progress/kendo-react-inputs';
import { MODE_FIELD, Mode } from '../Grid';
import { CellTemplate } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

const CheckboxCellTemplate: CellTemplate = (props) => {
  const { dataItem, field, dataIndex, column, onChange } = props;
  const { editable } = column;

  const mode = get(dataItem, MODE_FIELD);
  const path = field ?? '';
  const value = Boolean(get(dataItem, path));

  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  const handleChange: CheckboxProps['onChange'] = (event) => {
    onChange?.({
      dataIndex,
      dataItem: set(dataItem as Record<string, unknown>, path, event.value),
      syntheticEvent: event.syntheticEvent,
      field,
      value: event.target.value,
    });
  };

  return (
    <Checkbox
      value={value}
      disabled={!canBeModified}
      onChange={handleChange}
    />
  );
};

export default CheckboxCellTemplate;
