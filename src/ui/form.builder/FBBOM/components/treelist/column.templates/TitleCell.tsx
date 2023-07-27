import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import { ADD_FIELD } from '../../../constants';
import { EditableBOM } from '../../../interface';
import { getCellValue, isEditBOM } from '../utils';
import { styles } from './styles';
import { CustomTreeListCellProps } from './types';

const TitleCell: ComponentType<CustomTreeListCellProps> = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  hasChildren,
  ...otherProps
}) => {
  const classes = styles({ hasChildren, isEditMode: dataItem[ADD_FIELD] });
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
    >
      <span className={classes.titleInfoCell}>
        {getCellValue(isEditMode ? values : dataItem, field)}
      </span>
    </td>
  );
};

export default TitleCell;
