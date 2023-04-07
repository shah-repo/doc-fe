import React from "react";
import { get } from "lodash";
import Cell from "../Cell";
import { GridCellProps } from "@progress/kendo-react-grid";

const EmptyDashCell: React.FC<GridCellProps> = (props) => {
  const { dataItem, field } = props;

  const value = get(dataItem, field || "");

  return (
    <Cell {...props}>
      {value || "-"}
    </Cell>
  );
};

export default EmptyDashCell;
