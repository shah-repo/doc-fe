import { get } from 'lodash';
import React from 'react';
import Tooltip from '../kendo/Tooltip';
import { CustomGridCellProps } from '../kendo/types';

export const Default = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
  showTooltip,
  tooltipField = '',
}: CustomGridCellProps) => {
  const value = get(dataItem, field || '');
  const tooltipContent = get(dataItem, tooltipField || '');
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
      <Tooltip data={value} {...{ tooltipContent, showTooltip }}  />
    </td>
  );
};
