import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";

export const GroupsCell = (props) => {
  const groups = props.dataItem[props.field]?.map((emp) => emp.name);

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      <MultiSelect data={groups} filterable={true} value={groups} />
    </td>
  );
};
