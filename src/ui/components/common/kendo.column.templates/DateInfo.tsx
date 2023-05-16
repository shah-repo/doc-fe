import { Grid } from '@material-ui/core';
import { get } from 'lodash';
import React from 'react';
import { getFormattedDateString, MomentFormats } from '../../../../common/utils/date';
import Tooltip from '../kendo/Tooltip';
import { CustomGridCellProps } from '../kendo/types';

export const DateInfo = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}: CustomGridCellProps) => {
  const date = get(dataItem, field || '');
  const formattedDate = date ? getFormattedDateString(date, MomentFormats.MonthDateYear) : null;
  if (rowType === 'groupHeader') {
    return null;
  }
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
      onClick={cellClickEvent}
    >
      <Grid
        container
        direction="row"
        alignContent="flex-start"
        justify="flex-start"
      >
        {formattedDate && <Tooltip data={formattedDate} />}
      </Grid>
    </td>
  );
};
