import React from 'react';
import { get, set } from 'lodash';
import { Checkbox, CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import { MODE_FIELD, Mode } from '../Grid';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';

export default function CheckboxCellTemplate<T> (props: CellTemplateProps<T>): React.ReactNode {
  const { dataItem, field, dataIndex, column, onChange } = props;
  const { editable } = column;

  const path = field ?? '';
  const value = Boolean(get(dataItem, path));

  const handleChange = (e: CheckboxChangeEvent) => {
    onChange?.({
      dataIndex,
      dataItem: set(dataItem as Record<string, unknown>, path, e.value),
      syntheticEvent: e.syntheticEvent,
      field,
      value: e.target.value,
    });
  };

  const canBeUpdated = editable && [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  return (
    <Checkbox
      value={value}
      disabled={!canBeUpdated}
      onChange={handleChange}
    />
  );
}
