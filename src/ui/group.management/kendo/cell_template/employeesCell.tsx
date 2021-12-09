import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";

export const EmployeesCell = (props) => {
  const employee = props.dataItem[props.field]?.map((emp) => emp.user.name);

  return (<>
    {props.dataItem.inEdit && <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      <MultiSelect data={employee} filterable={true} value={employee} />
    </td>}
    {!props.dataItem.inEdit && <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      {employee}
    </td>}
  </>
  );
};
