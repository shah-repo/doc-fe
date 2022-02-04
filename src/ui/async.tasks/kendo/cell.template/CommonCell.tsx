import { GridCellProps } from "@progress/kendo-react-grid";
import { get } from "lodash";
import React from "react";
import Tooltip from "../../../components/common/kendo/Tooltip";
import KendoGridStyles from "../styles";

export const CommonCell = ({
  dataItem,
  rowType,
  colSpan,
  columnIndex,
  field,
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
      <Tooltip data={get(dataItem, field as string)} />
    </td>
  );
};
