import React from "react";
import gridConfiguration from "../kendogrid.column.definition";
import { DropdownFilterCell } from "./dropdown";

export const BooleanFilterCell = (props: any) => (
  <DropdownFilterCell
    {...props}
    data={gridConfiguration.booleanFilterCellOptions}
    defaultItem={{ text: "All", value: "All" }}
  />);
