import { get } from 'lodash';
import React from 'react';
import { getFormattedDateString, MomentFormats, toValidateIfDate } from '../../../../common/utils/date';
import { formatNumberToCurrency } from '../../../dashboard.new/line.items/common/Utils';
import Tooltip from '../kendo/Tooltip';
import { CustomGridCellProps } from '../kendo/types';

export const CommonCell = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}: CustomGridCellProps) => {
  const value = get(dataItem, field || '');
  const toCheckIfDate = toValidateIfDate(value);
  let formattedValue = toCheckIfDate
    ? getFormattedDateString(value, MomentFormats.MonthDateYear)
    : value;
  if (field === 'precalc.lhr_end_accepted_quantity' && value === -1) {
    formattedValue = 'N/A';
  }
  if (field === 'precalc.po_amount') {
    const currency = get(dataItem, 'precalc.po_currency');
    if (formattedValue == 'NULL') {
      formattedValue = formatNumberToCurrency(0);
    } else {
      formattedValue = currency ? currency + formattedValue : formattedValue;
    }
    style = { ...style, textAlign: 'right' };
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
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={cellClickEvent}
    >
      <Tooltip data={formattedValue} />
    </td>
  );
};
