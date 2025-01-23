import { GridCellProps } from '@progress/kendo-react-grid';
import React from 'react';
import { translate } from '../../../../common/intl';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { TextField } from '../../../components/forms/fields-next';
import { enterUserInfo } from '../column.definition';

export const EmailCell = ({
  dataItem,
  rowType,
  colSpan,
  columnIndex,
  style,
  className,
}: GridCellProps) => {
  const updateEmailField = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dataItem.email = target.value;
    enterUserInfo.email = target?.value;
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
          onChange={updateEmailField}
          placeholder={translate('common.email')}
          size="small"
        />
      ) : (
        <Tooltip
          data={
            dataItem.user ? dataItem.user.email : dataItem.items[0]?.user.email
          }
        />
      )}
    </td>
  );
};
