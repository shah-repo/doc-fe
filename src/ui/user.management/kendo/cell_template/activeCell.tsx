import React from "react";

export const ActiveCell = (props) => {
  const active = props.dataItem[props.field];

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      <span>{active ? "Active" : "Inactive"}</span>
    </td>
  );
};
