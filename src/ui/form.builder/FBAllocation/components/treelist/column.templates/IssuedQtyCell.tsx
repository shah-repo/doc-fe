import cx from 'classnames';
import React from 'react';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const IssuedQtyCell: React.ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren });
  const issuedQuantity = (dataItem.variance ?? 0) + (dataItem.quantityNeeded ?? 0);

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
      data-cy="cell-quantity"
    >
      <span className={classes.Cell}>
        {issuedQuantity}
      </span>
    </td>
  );
};

export default IssuedQtyCell;
