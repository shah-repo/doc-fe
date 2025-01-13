import * as React from 'react';
import { reorderIcon } from '@progress/kendo-svg-icons';
import { SvgIcon } from '@progress/kendo-react-common';
import { GridCellProps } from '@progress/kendo-react-grid';

export const DragHandleCell = (props: GridCellProps) => {
    const {
        ariaColumnIndex,
        dataItem,
        selectionChange,
        columnIndex,
        columnsCount,
        rowType,
        expanded,
        dataIndex,
        isSelected,
        ...rest
    } = props;

    return (
    <td
      {...rest as any}
      style={{
        touchAction: 'none',
      }}
    >
      <span
        style={{
          cursor: 'move',
        }}
        data-drag-handle="true"
      >
        <SvgIcon
          style={{
            pointerEvents: 'none',
          }}
          icon={reorderIcon}
        />
      </span>
    </td>
    );
};
