import { get } from 'lodash';
import React from 'react';
import OverflowContent from '../../OverflowContent';
import { CustomGridCellProps } from '../kendo/types';

export const OverflowCell: React.FunctionComponent<CustomGridCellProps> = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  const dataItemValue = get(dataItem, field ?? '');

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
      <OverflowContent title={dataItemValue}>
        {dataItemValue}
      </OverflowContent>
    </td>
  );
};
