import React from "react";
import gridConfiguration from "../column.definition";
import { DropdownFilterCell } from "./Dropdown";

export const BooleanFilterCell = (props: any) => (
  <DropdownFilterCell
    {...props}
    data={gridConfiguration.booleanFilterCellOptions}
    defaultItem={{ text: "All", value: "All" }}
  />);
