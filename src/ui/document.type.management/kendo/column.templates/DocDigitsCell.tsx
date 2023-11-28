import { DropDownList, DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import { GridCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { DTMRowItem } from '../types';

const MAX_DIGITS = 15;

interface Props extends GridCellProps {
  dataItem: DTMRowItem
}

interface ChangeEvent extends DropDownListChangeEvent {
  value: number
}

export const DocDigitsCell: React.FC<Props> = ({
  dataItem,
  field = '',
  rowType,
  onChange,
}) => {
  if (rowType !== 'data') {
    return null;
  }

  const isEdit = dataItem.inEdit;
  const value = dataItem[field] as number;
  const data: number[] = [];
  for (let i = 1; i <= MAX_DIGITS; i++) {
    data.push(i);
  }

  const handleChange = ({ value, syntheticEvent }: ChangeEvent) => onChange?.({
    dataIndex: 0,
    dataItem,
    field,
    syntheticEvent,
    value,
  });

  return (
    <td>
      {isEdit ? (
        <DropDownList
          data={data}
          value={value}
          onChange={handleChange}
        />
      ) : (
        <Tooltip data={value} />
      )}
    </td>
  );
};
