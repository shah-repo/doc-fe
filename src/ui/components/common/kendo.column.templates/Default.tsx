import { get } from "lodash";
import React from "react";

export const Default = (props) => {
  const value = get(props.dataItem, props.field);
  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      {value}
    </td>
  );
};
