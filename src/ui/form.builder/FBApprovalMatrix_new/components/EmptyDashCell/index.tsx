import React from "react";
import { get } from "lodash";
import Cell from "../Cell";
import { CellProps } from "../../types";

const EmptyDashCell: React.FC<CellProps> = (props) => {
  const { dataItem, field } = props;

  const value = get(dataItem, field || "");

  return (
    <Cell {...props}>
      {value || "-"}
    </Cell>
  );
};

export default EmptyDashCell;
