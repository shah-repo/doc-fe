import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { EditableAllocationItem } from '../../../interface';
import { CELL_EMPTY_VALUE } from '../constants';
import { getParsedFieldValue, isEditAllocItem } from '../utils';
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
  const { values } = useFormikContext<EditableAllocationItem>();
  const isEditMode = isEditAllocItem(dataItem);
  const isLotAddition = dataItem.isLotAddition || dataItem.lotRevId;

  let quantityNeeded = dataItem.quantityNeeded ?? 0;
  if (isEditMode && !isLotAddition) {
    quantityNeeded = dataItem?.isNewAddition ? getParsedFieldValue(values.quantityNeeded) : (dataItem.quantityNeeded ?? 0);
  }
  const issuedQuantity = isEditMode ? (getParsedFieldValue(values.variance) + quantityNeeded) : ((dataItem.variance ?? 0) + quantityNeeded);

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
        {isLotAddition ? CELL_EMPTY_VALUE : issuedQuantity}
      </span>
    </td>
  );
};

export default IssuedQtyCell;
