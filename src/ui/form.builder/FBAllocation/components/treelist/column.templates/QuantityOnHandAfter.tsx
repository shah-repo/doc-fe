import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isNil } from 'lodash';
import React from 'react';
import { DocumentRevisionStatus } from '../../../../../../state/ducks/documentRevisions/types';
import { EditableAllocationItem } from '../../../interface';
import { CELL_EMPTY_VALUE } from '../constants';
import { getParsedFieldValue, isEditAllocItem } from '../utils';
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
  const { values } = useFormikContext<EditableAllocationItem>();
  const isEditMode = isEditAllocItem(dataItem);

  let quantityNeeded: number = dataItem.quantityNeeded ?? 0;
  if (isEditMode) {
    if (values.isLotAddition) {
      quantityNeeded = getParsedFieldValue(values.quantityNeeded);
    } else {
      quantityNeeded = dataItem?.isNewAddition ? getParsedFieldValue(values.quantityNeeded) : quantityNeeded;
    }
  }

  const renderCellValue = () => {
    if (dataItem.woStatus !== DocumentRevisionStatus.Draft) {
      if (!(dataItem.isLotAddition || dataItem.lotRevId)) {
        // This cell is not applicable for parts row
        return CELL_EMPTY_VALUE;
      }

      return dataItem.quantityAfterKitting ?? 0;
    }

    return isNil(dataItem.quantityOnHand)
      ? CELL_EMPTY_VALUE
      : (dataItem.quantityOnHand ?? 0) - (quantityNeeded ?? 0);
  };

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
      data-cy={`${field}-cell-quantity`}
    >
      <span className={classes.Cell}>
        {renderCellValue()}
      </span>
    </td>
  );
};

export default QuantityOnHandAfter;
