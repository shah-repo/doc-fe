import cx from 'classnames';
import React from 'react';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

export const PrimaryAttachmentsCell: React.FC<CustomTreeListCellProps> = ({
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
  >
    <img src={dataItem.primaryAttachments} alt="" width="100%" />
  </td>;
};
