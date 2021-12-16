import { DropDownList } from "@progress/kendo-react-dropdowns/dist/npm/DropDownList/DropDownList";
import { get } from "lodash";
import React from "react";
import GridCellStyles from "./grid.cell.styles";

export const CellFormatter1 = (props) => {
  if (props.rowType === "groupHeader") {
    return null;
  }
  const classes = GridCellStyles();
  const formattedValue = get(props.dataItem, props.field) ? "Active" : "Inactive";
  return (
    <td colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}>

      <div className={classes.topButton}>
        <span className={`${classes.dot} ${classes[formattedValue]}`}></span>
        <p className={classes.value}>{formattedValue}</p>
      </div>
    </td>
  );
};
export const CellFormatter = (props) => {
  const localizedData = [{ text: "Active", value: true }, { text: "Inactive", value: false }];
  const isEdit = get(props.dataItem, "inEdit");
  const formattedValue = get(props.dataItem, props.field) ? "Active" : "Inactive";
  if (props.rowType === "groupHeader") {
    return null;
  }
  const classes = GridCellStyles();
  const handleChange = (e) => {
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value,
      });
    }
  };

  const { dataItem } = props;
  const field = props.field || "";
  const dataValue = dataItem[field] === null ? "" : dataItem[field];
  return (
    <td colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}>
      {isEdit ? (
        <DropDownList
          onChange={handleChange}
          value={localizedData.find((c) => c.value === dataValue)}
          data={localizedData}
          textField="text"
        />
      ) : (
        <div className={classes.topButton}>
          <span className={`${classes.dot} ${classes[formattedValue]}`}></span>
          <p className={classes.value}>{formattedValue}</p>
        </div>
      )}
    </td>
  );
};
