import cx from 'classnames';
import React from 'react';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

export const Comments: React.FC<CustomTreeListCellProps> = ({
  dataItem,
  colSpan,
  style,
  className,
}) => {
  const classes = styles();
  return <td
    colSpan={colSpan}
    style={style}
    role="gridcell"
    className={cx(className, classes.cellborderBottom)}
  >{dataItem.comments ?? '-'}
  </td>;
};
