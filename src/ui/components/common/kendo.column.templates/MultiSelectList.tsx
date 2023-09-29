import React from 'react';
import { CustomGridCellProps } from '../kendo/types';
import { Chip } from '@material-ui/core';
import useStyles from './MultiSelectList.styles';

export const MultiSelectList: React.FC<CustomGridCellProps> = ({
  dataItem,
  field = '',
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  const classes = useStyles();

  const cellClickEvent = () => {
    cellRowClick?.({ dataItem });
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      data-cy="cell-status"
      onClick={cellClickEvent}
    >
      {dataItem.document.relatedEquipment.map(label => (
        <Chip
          key={label}
          size="small"
          label={label}
          className={classes.chip}
        />
      ))}
    </td>
  );
};
