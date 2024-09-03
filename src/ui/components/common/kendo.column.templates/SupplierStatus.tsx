import { Grid } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { CustomGridCellProps } from '../kendo/types';
import useStyles from './Status.styles';

export const SupplierStatus: React.FC<CustomGridCellProps> = ({
  dataItem,
  field = '',
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  const classes = useStyles();
  const status = dataItem[field] as string;
  const cellClickEvent = () => {
    if (!cellRowClick) { return; }
    cellRowClick({ dataItem });
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
      <Grid
        justify="flex-start"
        alignItems="center"
        container
        data-cy={`supplier-status-button-${status}`}
      >
        <div className={cx(classes.statusIcon, classes[status])} />
        {status}
      </Grid>

    </td>
  );
};
