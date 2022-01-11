import { GridCellProps } from "@progress/kendo-react-grid";
import { get } from "lodash";
import React from "react";
import Tooltip from "../kendo/Tooltip";

export const Default = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  columnIndex,
}: GridCellProps) => {
  const value = get(dataItem, field || "");
  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      <Tooltip data={value}/>
    </td>
  );
};
