import React from "react";
import { CellProps } from "../../types";

const Cell: React.FC<CellProps> = (props) => {
  const { colSpan, style, className, columnIndex, children } = props;

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
