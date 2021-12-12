import { DropDownList } from "@progress/kendo-react-dropdowns";
import React from "react";

export const GroupCell = (props) => {
  const employee = props.dataItem[props.field];
  const localizedData = [
    { text: "Official", value: true },
    { text: "Unofficial", value: false },
  ];
  const updateGroupField = (event: any) => {
    const Selectedvalue = event?.target?.value;
    // eslint-disable-next-line no-console
    console.log("Selectedvalue", Selectedvalue.value);
    props.dataItem.employee = Selectedvalue.value;
  };

  return (
    <td>
      {props.dataItem.inEdit ? (
        <DropDownList
          onChange={updateGroupField}
          data={localizedData}
          textField="text"
        />
      ) : (
        <span>{employee ? "Official" : "Unofficial"}</span>
      )}
    </td>
  );
};
