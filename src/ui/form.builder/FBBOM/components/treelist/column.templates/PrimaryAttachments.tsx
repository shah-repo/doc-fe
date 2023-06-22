import React from 'react';
import { CustomTreeListCellProps } from './types';

export const PrimaryAttachmentsCell: React.FC<CustomTreeListCellProps> = ({
  dataItem,
  colSpan,
  style,
  className,
}) => {
  return <td
    colSpan={colSpan}
    style={style}
    role="gridcell"
    className={className}
  >
    <img src={dataItem.primaryAttachments} alt="" width="100%" />
  </td>;
};
