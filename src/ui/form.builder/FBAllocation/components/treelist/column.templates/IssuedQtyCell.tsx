import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { EditableAllocationItem } from '../../../interface';
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

  let quantityNeeded = dataItem.quantityNeeded ?? 0;
  if (isEditMode) {
    if (values.isLotAddition) {
      quantityNeeded = getParsedFieldValue(values.quantityNeeded);
    } else {
      quantityNeeded = dataItem?.isNewAddition ? getParsedFieldValue(values.quantityNeeded) : (dataItem.quantityNeeded ?? 0);
    }
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
        {issuedQuantity}
      </span>
    </td>
  );
};

export default IssuedQtyCell;
