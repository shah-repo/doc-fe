import { TextField } from '@material-ui/core';
import { GridCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { enterUserInfo } from '../column.definition';

export const NameCell = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
}: GridCellProps) => {
  const updateNameField = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dataItem.name = target?.value;
    enterUserInfo.name = target?.value;
  };
  if (rowType === 'groupHeader') {
    return null;
  }
  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {dataItem.inEdit ? (
        <TextField
          id="input-with-icon-textfield"
          variant="outlined"
          margin="dense"
          onChange={updateNameField}
        />
      ) : (
        <Tooltip
          data={
            dataItem.user ? dataItem.user.name : dataItem.items[0]?.user?.name
          }
        />
      )}
    </td>
  );
};
