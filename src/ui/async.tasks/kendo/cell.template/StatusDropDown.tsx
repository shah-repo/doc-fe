import { GridFilterCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { DropdownFilterCell } from "./DropdownFilterCell";

export const StatusDropDown = (props: GridFilterCellProps) => {
  const options = ["IN_PROGRESS", "REQUESTED", "COMPLETE"];
  return (
    <DropdownFilterCell
      {...props}
      data={options}
      defaultItem={"Select Status"}
    />
  );
};
