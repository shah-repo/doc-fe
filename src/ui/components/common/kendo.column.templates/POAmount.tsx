import { get } from 'lodash';
import React from 'react';
import { formatNumberToCurrency } from '../../../dashboard.new/line.items/common/Utils';
import Tooltip from '../kendo/Tooltip';
import { CustomGridCellProps } from '../kendo/types';

export const POAmount: React.FunctionComponent<CustomGridCellProps> = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  let formattedValue = get(dataItem, field ?? '');
  const currency = get(dataItem, 'precalc.po_currency') as string;

  if (formattedValue === 'NULL') {
    formattedValue = formatNumberToCurrency(0);
  } else {
    formattedValue = currency ? `${currency}${formattedValue}` : formattedValue;
  }

  const cellClickEvent = () => {
    if (!cellRowClick) { return; }
    cellRowClick({ dataItem });
  };
  if (rowType === 'groupHeader') {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      style={{ ...style, textAlign: 'right' }}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={cellClickEvent}
    >
      <Tooltip data={formattedValue} />
    </td>
  );
};
