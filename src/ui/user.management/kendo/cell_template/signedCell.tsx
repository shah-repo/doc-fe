import React from "react";

export const SignedCell = (props) => {
  const signed = props.dataItem.user.confirmed;

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      <span>{signed ? "Signed up" : "Not Signed up"} </span>
    </td>
  );
};
