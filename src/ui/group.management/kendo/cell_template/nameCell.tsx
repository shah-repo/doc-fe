import React from "react";

export const GroupCell = (props) => {
  const employee = props.dataItem[props.field];

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      <span>{employee ? "Official" : "Unofficial"}</span>
    </td>
  );
};
