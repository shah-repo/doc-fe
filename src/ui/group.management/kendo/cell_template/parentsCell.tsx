import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";

export const ParentsCell = (props) => {
  const parents = props.dataItem[props.field]?.map((parent) => parent.name);

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
          <MultiSelect data={parents} filterable={true} value={parents} />
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
          {parents}
        </td>
      )}
    </>
  );
};
