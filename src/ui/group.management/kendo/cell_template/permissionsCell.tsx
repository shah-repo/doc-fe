import React from "react";

export const PermissionsCell = (props) => {
  const permissions = props.dataItem[props.field]?.map((perm) => perm);

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
        <span>{permissions}</span>
      )}
    </td>
  );
};
