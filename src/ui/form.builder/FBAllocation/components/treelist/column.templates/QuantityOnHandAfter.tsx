import cx from 'classnames';
import { isNil } from 'lodash';
import React from 'react';
import { CELL_EMPTY_VALUE } from '../constants';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const QuantityOnHandAfter: React.ComponentType<CustomTreeListCellProps> = ({
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
      data-cy="cell-quantity"
    >
      <span className={classes.Cell}>
        {isNil(dataItem.quantityOnHand) ? CELL_EMPTY_VALUE : (dataItem.quantityNeeded ?? 0) - (dataItem.quantityOnHand ?? 0)}
      </span>
    </td>
  );
};

export default QuantityOnHandAfter;
