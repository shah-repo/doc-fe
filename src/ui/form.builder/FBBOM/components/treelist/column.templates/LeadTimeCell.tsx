import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import { EditableBOM } from '../../../interface';
import { getCellValue, isEditBOM } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const LeadTimeCell: ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren });
  const { values } = useFormikContext<EditableBOM>();
  const isEditMode = isEditBOM(dataItem);

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
      data-cy="cell-lead-time"
    >
      <span className={classes.Cell}>
        {getCellValue(isEditMode ? values : dataItem, field)}
      </span>
    </td>
  );
};

export default LeadTimeCell;
