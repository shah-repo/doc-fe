import React from 'react';
import { get, set } from 'lodash';
import {
  Checkbox, CheckboxChangeEvent,
} from '@progress/kendo-react-inputs';
import { MODE_FIELD, Mode } from '../Grid';
import { CellProps } from '../../types';

const CheckboxCell: React.FC<CellProps> = (props) => {
  const { dataItem, field, dataIndex, editable, onChange } = props;

  const path = field ?? '';
  const value = Boolean(get(dataItem, path));

  const handleChange = (e: CheckboxChangeEvent) => {
    onChange?.({
      dataIndex,
      dataItem: set(dataItem, path, e.value),
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
};

export default CheckboxCell;
