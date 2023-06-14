import { Box } from '@material-ui/core';
import { GridCellProps } from '@progress/kendo-react-grid';
import {
  NumericTextBox, NumericTextBoxChangeEvent,
} from '@progress/kendo-react-inputs';
import { result, set } from 'lodash';
import React, { useEffect } from 'react';
import { Nullable } from '../../../../state/ducks/common/types';
import './KendoStyles.css';

export const IntegerNumberCell: React.FunctionComponent<GridCellProps> = ({
  dataItem,
  field,
  onChange,
  dataIndex,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
}) => {
  const editMode = dataItem.inEdit;
  const path = field || '';
  const [dataValue, setValue] = React.useState<Nullable<number>>(dataItem[path] || 0);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setValue(result(dataItem, path));
  });

  const handleChange = ({ value, target, syntheticEvent }: NumericTextBoxChangeEvent) => {
    if (onChange) {
      setValue(value);
      onChange({
        dataIndex,
        dataItem: set(dataItem, path, value),
        syntheticEvent,
        field,
        value: target.value,
      });
      setTimeout(() => {
        document.getElementById('k-input-dtm-sn')?.focus();
      });
    }
  };

  if (rowType === 'groupHeader') {
    return null;
  }
  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={`checkbox-cell ${className}`}
      data-grid-col-index={columnIndex}
    >
      {editMode ? (
        <NumericTextBox
          id="k-input-dtm-sn"
          min={0}
          format="0"
          defaultValue={dataValue}
          onChange={handleChange}
        />
      ) : (
        <Box display="flex">{dataValue}</Box>
      )}
    </td>
  );
};
