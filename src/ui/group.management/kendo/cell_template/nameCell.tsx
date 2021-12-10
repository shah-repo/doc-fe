import React from "react";

export const NameCell = (props) => (
  <>
    {!props.dataItem.inEdit && (
      <td
        colSpan={props.colSpan}
        role="gridcell"
        aria-colindex={props.ariaColumnIndex}
        aria-selected="false"
        data-grid-col-index={props.columnIndex}
      >
        <span>{props.dataItem.name}</span>
      </td>
    )}
    {props.dataItem.inEdit && (
      <td
        colSpan={props.colSpan}
        role="gridcell"
        aria-colindex={props.ariaColumnIndex}
        aria-selected="false"
        data-grid-col-index={props.columnIndex}
      >
        <span>Please add text field here</span>
      </td>
    )}
  </>
);
