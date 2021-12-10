import React from "react";

export const GroupCell = (props) => {
  const employee = props.dataItem[props.field];

  return (
    <>
      {!props.dataItem.inEdit && (
        <td
          colSpan={props.colSpan}
          role="gridcell"
          aria-colindex={props.ariaColumnIndex}
          aria-selected="false"
          data-grid-col-index={props.columnIndex}
        >
          <span>{employee ? "Official" : "Unofficial"}</span>
        </td>
      )}
      {props.dataItem.inEdit && (
        // add radio buttons for selection
        <td
          colSpan={props.colSpan}
          role="gridcell"
          aria-colindex={props.ariaColumnIndex}
          aria-selected="false"
          data-grid-col-index={props.columnIndex}
        >
          <span>Please add radio buttons here</span>
        </td>
      )}
    </>
  );
};
