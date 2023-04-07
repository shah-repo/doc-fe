import React from "react";
import { GridCellProps } from "@progress/kendo-react-grid";

const Cell: React.FC<GridCellProps> = (props) => {
  const {
    colSpan, style, className,
    rowType, columnIndex,
    children,
  } = props;

  if (rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {children}
    </td>
  );
};

export default Cell;
