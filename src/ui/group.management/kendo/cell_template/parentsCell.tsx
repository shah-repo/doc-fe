import React from "react";

export const ParentsCell = (props) => {
  const parents = props.dataItem[props.field]?.map((parent) => parent.name);

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      {props.dataItem.inEdit ? (
        <span>{"Type Here"}</span>
      ) : (
        <span>{parents}</span>
      )}
    </td>
  );
};
