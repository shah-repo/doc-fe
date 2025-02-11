import { GridCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { translate } from '../../../../common/intl';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { TextField } from '../../../components/forms/fields-next';
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
          onChange={updateNameField}
          placeholder={translate('common.name')}
          size="small"
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
