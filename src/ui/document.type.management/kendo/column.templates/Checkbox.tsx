
import { GridCellProps } from "@progress/kendo-react-grid";
import {
  Checkbox,
  CheckboxChangeEvent,
} from "@progress/kendo-react-inputs";
import { result, set } from "lodash";
import React, { useEffect } from "react";
import "./KendoStyles.css";

export const CheckboxCell = (props: GridCellProps) => {
  const editMode = props.dataItem.inEdit;
  const field = props.field || "";
  const [dataValue, setValue] = React.useState<boolean | null | undefined>(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setValue(result(props.dataItem, field));
  });

  const handleChange = (e: CheckboxChangeEvent) => {
    if (props.onChange) {
      setValue(e.value);
      // for parent component
      props.onChange({
        dataIndex: props.dataIndex,
        dataItem: set(props.dataItem, field, e.value), // checkbox does not update so setting it
        syntheticEvent: e.syntheticEvent,
        field: props.field,
        value: e.target.value,
      });
    }
  };

  if (props.rowType === "groupHeader") {
    return null;
  }

  return (
    <td colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      className={`checkbox-cell ${props.className}`}
      data-grid-col-index={props.columnIndex}
    >
      <Checkbox
        value={dataValue}
        onChange={handleChange}
        disabled={editMode ? false : true}/>
    </td>
  );
};
