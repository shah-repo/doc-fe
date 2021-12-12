import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import { toMembersOptions } from "../../utils/transform";

export const EmployeesCell = (props) => {
  const employees = props.dataItem[props.field]?.map((emp) => emp.user.name);
  const updateMembersField = (event: any) => {
    props.dataItem.employees = event?.target?.value.map((e) => e.value);
  };
  const result = Object.keys(toMembersOptions(props.employees)).map(
    (key) => (Number(key), toMembersOptions(props.employees)[key])
  );

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
    >
      {props.dataItem.inEdit ? (
        <MultiSelect
          data={result}
          filterable={true}
          onChange={updateMembersField}
          dataItemKey="value"
          textField="label"
        />
      ) : (
        <span>{employees}</span>
      )}
    </td>
  );
};
