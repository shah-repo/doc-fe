import {
  GridColumnMenuGroup,
  GridColumnMenuItemGroup,
  GridColumnMenuProps,
} from "@progress/kendo-react-grid";
import React from "react";

export const ColumnMenu = (props: GridColumnMenuProps) => (
  <div>
    <GridColumnMenuItemGroup>
      <GridColumnMenuGroup {...props} />
    </GridColumnMenuItemGroup>
  </div>
);
