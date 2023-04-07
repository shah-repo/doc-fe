import React from "react";
import { get } from "lodash";
import { Checkbox } from "@material-ui/core";
import { GridCellProps } from "@progress/kendo-react-grid";

const CheckboxCell: React.FC<GridCellProps> = (props) => {
  const {
    dataItem, field,
    colSpan, style, className,
    rowType, columnIndex,
  } = props;

  const value = Boolean(get(dataItem, field || ""));

  if (rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      <Checkbox
        checked={value}
      />
    </td>
  );
};

export default CheckboxCell;
