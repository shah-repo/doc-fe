import React from "react";

export const TagsCell = (props) => {
  const tags = props.dataItem[props.field]?.map((tag) => tag);

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      {props.dataItem.inEdit && props.isOfficial ? <span>{"Type Here"}</span> : <span>{tags}</span>}
    </td>
  );
};
