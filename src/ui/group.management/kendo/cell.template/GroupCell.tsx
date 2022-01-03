/* eslint-disable react-hooks/exhaustive-deps */
import { DropDownList } from "@progress/kendo-react-dropdowns";
import React from "react";

export const GroupCell = (props) => {
  const isOfficial = props.dataItem[props.field];
  const localizedData = [
    { text: "Official", value: true },
    { text: "Unofficial", value: false },
  ];
  const updateGroupField = (event: any) => {
    const Selectedvalue = event?.target?.value;
    // eslint-disable-next-line no-console
    console.log("Selectedvalue", Selectedvalue.value);
    props.dataItem.isOfficial = Selectedvalue.value;
    props.setOfficial(Selectedvalue.value);
  };
  const valueSelected = localizedData.filter(
    (e) => e.value === props.isOfficial
  )[0];

  if (props.rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      {props.dataItem.inEdit ? (
        <DropDownList
          onChange={updateGroupField}
          data={localizedData}
          textField="text"
          dataItemKey="value"
          value={valueSelected}
        />
      ) : (
        <span>{isOfficial ? "Official" : "Unofficial"}</span>
      )}
    </td>
  );
};
