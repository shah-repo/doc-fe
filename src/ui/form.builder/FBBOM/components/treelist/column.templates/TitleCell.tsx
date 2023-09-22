import { Box } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React, { ComponentType } from 'react';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { EditableBOM } from '../../../interface';
import { ADD_FIELD } from '../constants';
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
  const displayValue = getCellValue(isEditMode ? values : dataItem, field);

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
      data-cy="cell-title"
    >
      <Box className={classes.titleInfoCell}>
        <OverflowTooltip
          title={displayValue}
          placement="top"
          interactive
          arrow
        >
          {displayValue}
        </OverflowTooltip>
      </Box>
    </td>
  );
};

export default TitleCell;
