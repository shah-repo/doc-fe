import { get } from 'lodash';
import React from 'react';
import { formatNumberToCurrency } from '../../../dashboard.new/line.items/common/Utils';
import Tooltip from '../kendo/Tooltip';
import { CustomGridCellProps } from '../kendo/types';

export const POAmountWithCurrency: React.FunctionComponent<CustomGridCellProps> = ({
  dataItem,
  field = '',
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  if (rowType === 'groupHeader') {
    return null;
  }

  const value = get(dataItem, field);
  const formattedValue = value === 'NULL' ? formatNumberToCurrency(0) : value;

  const cellClickEvent = () => cellRowClick?.({ dataItem });

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
