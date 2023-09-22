import cx from 'classnames';
import React, { ComponentType } from 'react';
import { getCellValue } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const CostCell: ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren });
  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={cx('k-table-td', className, classes.cellborderBottom)}
      {...{
        'aria-colindex': otherProps.ariaColumnIndex,
        'data-grid-col-index': otherProps.colIndex,
        'aria-expanded': otherProps.expanded,
      }}
      data-cy="cell.cost"
    >
      <span className={classes.Cell}>
        {`${getCellValue(dataItem, field)} `}
      </span>
    </td>
  );
};

export default CostCell;
