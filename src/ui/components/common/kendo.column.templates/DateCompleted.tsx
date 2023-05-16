import React from 'react';
import { useIntl } from 'react-intl';
import { getFormattedDateString, MomentFormats } from '../../../../common/utils/date';
import Tooltip from '../kendo/Tooltip';
import { CustomGridCellProps } from '../kendo/types';

export const DateCompleted = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}: CustomGridCellProps) => {
  const intl = useIntl();
  const date = dataItem[field || ''];
  const formattedDate = date
    ? getFormattedDateString(date, MomentFormats.DateTimeComplete)
    : intl.formatMessage({ id: 'common.pending' });
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
      {formattedDate && <Tooltip data={formattedDate} />}
    </td>
  );
};
