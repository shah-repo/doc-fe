import { GridCellProps } from "@progress/kendo-react-grid";
import React from "react";
import Tooltip from "../../../components/common/kendo/Tooltip";
import KendoGridStyles from "../styles";

export const EmailCell = ({
  dataItem,
  rowType,
  colSpan,
  columnIndex,
}: GridCellProps) => {
  const classes = KendoGridStyles();
  if (rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      role="gridcell"
      data-grid-col-index={columnIndex}
      className={classes.groupCell}
    >
      <Tooltip data={dataItem.employee.user.email} />
    </td>
  );
};
