import { get } from 'lodash';
import React from 'react';
import OverflowContent from '../../OverflowContent';
import { CustomGridCellProps } from '../kendo/types';

export const DocIdListCell: React.FunctionComponent<CustomGridCellProps> = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  const list = field ? get(dataItem, field, []) : [];
  const formattedValue = list.map(item => item.docId).filter(Boolean).join(', ');

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
      style={{ ...style, textAlign: 'left' }}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={cellClickEvent}
    >
      <OverflowContent title={formattedValue}>
        {formattedValue}
      </OverflowContent>
    </td>
  );
};
