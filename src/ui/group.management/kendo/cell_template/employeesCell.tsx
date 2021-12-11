/* eslint-disable no-console */
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import { toMembersOptions } from "../../utils/transform";

export const EmployeesCell = (props) => {
  const employees = props.dataItem[props.field]?.map((emp) => emp.user.name);
  const updateMembersField = (event: any) => {
    props.dataItem.employees = event?.target?.value;
  };
  return (<>
    {props.dataItem.inEdit && <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      <MultiSelect data={(toMembersOptions(props.employees)).map((e) => e.label)} filterable={true} onChange={updateMembersField} />
    </td>}
    {!props.dataItem.inEdit && <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      {employees}
    </td>}
  </>
  );
};
