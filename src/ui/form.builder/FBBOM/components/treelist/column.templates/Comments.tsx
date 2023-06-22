import React from 'react';
import { CustomTreeListCellProps } from './types';

export const Comments: React.FC<CustomTreeListCellProps> = ({
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
  >{dataItem.comments ?? '-'}
  </td>;
};
