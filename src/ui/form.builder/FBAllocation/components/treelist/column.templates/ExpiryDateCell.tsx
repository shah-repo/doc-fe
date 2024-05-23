import cx from 'classnames';
import React, { ComponentType } from 'react';
import { getFormattedDateString, MomentFormats } from '../../../../../../common/utils/date';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const ExpiryDateCellTemplate: ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren });
  const fieldValue = field && dataItem[field];
  console.log('fieldValue :', fieldValue, dataItem);
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
      data-cy="unit-cell"
    >
      <span className={cx(classes.Cell, { [classes.expired]: dataItem.isExpired && fieldValue })}>
        {fieldValue && getFormattedDateString(fieldValue, MomentFormats.MonthDateYearTwoDigit)}
      </span>
    </td>
  );
};

export default ExpiryDateCellTemplate;
