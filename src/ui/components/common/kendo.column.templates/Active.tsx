import React from "react";
import { get } from "lodash";
import { CustomGridCellProps } from "../kendo/types";
import Text from "../../Text";

export const Active = ({
  dataItem,
  field,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}: CustomGridCellProps) => {
  const value = Boolean(get(dataItem, field || ""));

  if (rowType === "groupHeader") {
    return null;
  }

  const cellClickEvent = () => {
    if (!cellRowClick) { return; }
    cellRowClick({ dataItem });
  };

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      onClick={cellClickEvent}
    >
      <Text translation={value ? "common.active" : "common.inactive"} />
    </td>
  );
};
