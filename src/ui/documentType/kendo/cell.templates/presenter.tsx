import { get } from "lodash";
import moment from "moment";
import React from "react";
import { toValidateIfDate } from "../../../components/common/kendo.column.templates/helper";
import KendoGridStyles from "../styles";

export const CellTemplate = (props) => {
  const value = get(props.dataItem, props.field);
  // To check if value is date
  const toCheckIfDate =  toValidateIfDate(value);
  const formattedValue = toCheckIfDate ? moment(value).format("MM/DD/YYYY") : value;
  if (props.rowType === "groupHeader") {
    return null;
  }
  return (
    <td colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}> {formattedValue}</td>
  );
};

export const KendoStatusCell = (props) => {
  const classes = KendoGridStyles();
  const status = props.dataItem.displayStatus;
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
      // TODO: Update as per response
      data-grid-col-index={props.columnIndex}
    >
      <span
        className={`${classes.chip} ${classes[status.replaceAll(" ", "")]}`}
      >
        {status}
      </span>
    </td>
  );
};
