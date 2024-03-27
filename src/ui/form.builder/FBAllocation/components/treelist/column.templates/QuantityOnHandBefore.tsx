import cx from 'classnames';
import { useFormikContext } from 'formik';
import { isNil } from 'lodash';
import React from 'react';
import { DocumentRevisionStatus } from '../../../../../../state/ducks/documentRevisions/types';
import { EditableAllocationItem } from '../../../interface';
import { CELL_EMPTY_VALUE } from '../constants';
import { isEditAllocItem } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const QuantityOnHandBefore: React.ComponentType<CustomTreeListCellProps> = ({
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
  let value = isEditMode ? values?.quantityOnHand : dataItem?.quantityOnHand;

  if (dataItem.woStatus !== DocumentRevisionStatus.Draft) {
    value = dataItem.quantityBeforeKitting;
  }

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
        {isNil(value) ? CELL_EMPTY_VALUE : value}
      </span>
    </td>
  );
};

export default QuantityOnHandBefore;
