import { TextField } from '@material-ui/core';
import React from 'react';
import Tooltip from '../../../components/common/kendo/Tooltip';

interface NameCellProps {
  dataItem: any
  rowType?: string
  colSpan?: number
  style?: React.CSSProperties
  className?: string
  columnIndex?: number
}

export const NameCell = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
}: NameCellProps) => {
  const [name, setName] = React.useState('');
  const updateNameField = ({ target }) => {
    setName(target?.value);
    dataItem.name = target?.value;
  };

  if (rowType === 'groupHeader') {
    return null;
  }

  return (
    <>
      {!dataItem.inEdit && (
        <td
          colSpan={colSpan}
          style={style}
          role="gridcell"
          className={className}
          data-grid-col-index={columnIndex}
        >
          <Tooltip data ={dataItem.name} />
        </td>
      )}
      {dataItem.inEdit && (
        <td
          colSpan={colSpan}
          style={style}
          role="gridcell"
          className={className}
          data-grid-col-index={columnIndex}
        >

          <TextField
            id="input-with-icon-textfield"
            variant="outlined"
            margin="dense"
            value={name}
            onChange={updateNameField}
          />
        </td>
      )}
    </>
  ); };
