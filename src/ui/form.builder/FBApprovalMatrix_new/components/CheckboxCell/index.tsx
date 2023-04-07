import React from "react";
import { get } from "lodash";
import Cell from "../Cell";
import { Checkbox } from "@material-ui/core";
import { GridCellProps } from "@progress/kendo-react-grid";

const CheckboxCell: React.FC<GridCellProps> = (props) => {
  const { dataItem, field } = props;

  const value = Boolean(get(dataItem, field || ""));

  return (
    <Cell {...props}>
      <Checkbox
        checked={value}
      />
    </Cell>
  );
};

export default CheckboxCell;
