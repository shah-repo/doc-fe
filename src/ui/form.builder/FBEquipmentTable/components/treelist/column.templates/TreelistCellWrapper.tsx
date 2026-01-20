import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import cx from 'classnames';
import React from 'react';
import { ADD_FIELD, MODE_FIELD } from '../constants';
import useStyles from './styles';
import { CustomTreeListCellProps } from './types';

const TreeListCellWrapper: React.FC<CustomTreeListCellProps & { children: React.ReactNode }> = ({
  children,
  colSpan,
  style,
  className,
  hasChildren,
  ariaColumnIndex,
  colIndex,
  dataItem,
  expanded,
  field,
  id,
  onClick,
}) => {
  const classes = useStyles({ hasChildren });
  const handleClick = (event) => {
    if (dataItem[ADD_FIELD] || dataItem[MODE_FIELD]) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.({ dataItem });
  };
  const navigationAttributes = useTableKeyboardNavigation(id);

  return (
    <td
      colSpan={colSpan}
      style={style}
      id={id}
      role="gridcell"
      {...navigationAttributes}
      className={cx('k-table-td', className, classes.cellBorderBottom, className)}
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={colIndex}
      aria-expanded={expanded}
      onClick={handleClick}
      data-cy={`${field}-cell`}
    >
      {children}
    </td>
  );
};

export default TreeListCellWrapper;
