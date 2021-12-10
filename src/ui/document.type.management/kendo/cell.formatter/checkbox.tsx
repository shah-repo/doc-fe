import { GridCellProps } from "@progress/kendo-react-grid";
import {
  Checkbox,
  CheckboxChangeEvent,
} from "@progress/kendo-react-inputs";
import React from "react";

export const CheckboxCell = (props: GridCellProps) => {
  if (props.rowType === "groupHeader") {
    return null;
  }
  const handleChange = (e: CheckboxChangeEvent) => {
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value,
      });
    }
  };

  const { dataItem } = props;
  const field = props.field || "";
  const dataValue = dataItem[field] || false;

  return (
    <td colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}>
      <Checkbox
        value={dataValue}
        onChange={handleChange}
        disabled={dataItem.inEdit ? false : true}/>
    </td>
  );
};
