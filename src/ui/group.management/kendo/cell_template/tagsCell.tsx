import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";

export const TagsCell = (props) => {
  const tags = props.dataItem[props.field]?.map((tag) => tag);

  return (
    <>
      {props.dataItem.inEdit && (
        <td
          colSpan={props.colSpan}
          role="gridcell"
          aria-colindex={props.ariaColumnIndex}
          aria-selected="false"
          data-grid-col-index={props.columnIndex}
        >
          <MultiSelect data={tags} filterable={true} value={tags} />
        </td>
      )}
      {!props.dataItem.inEdit && (
        <td
          colSpan={props.colSpan}
          role="gridcell"
          aria-colindex={props.ariaColumnIndex}
          aria-selected="false"
          data-grid-col-index={props.columnIndex}
        >
          {tags}
        </td>
      )}
    </>
  );
};
