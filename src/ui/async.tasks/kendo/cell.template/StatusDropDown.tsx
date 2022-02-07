import { GridFilterCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { AsyncStatus } from "../helper";
import { DropdownFilterCell } from "./DropdownFilterCell";

export const StatusDropDown = (props: GridFilterCellProps) => (
  <DropdownFilterCell
    {...props}
    data={AsyncStatus}
    defaultItem={"Select Status"}
  />
);
