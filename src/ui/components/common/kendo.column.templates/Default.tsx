import { get } from "lodash";
import React from "react";
import { GridCellProperties } from "../kendo/types";

export const Default = (props: GridCellProperties) => {
  const value = get(props.dataItem, props.field || "");
  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      {value}
    </td>
  );
};
