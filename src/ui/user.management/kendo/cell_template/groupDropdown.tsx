import { GridFilterCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import { DropdownFilterCell } from "./dropdown.filter.cell";

export const GroupDropdown: any = (props: GridFilterCellProps) => {
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);

  return  (
    <DropdownFilterCell
      {...props}
      data={groupOptions.map((col) => col.text)}
      defaultItem={"Select Groups"}
    />
  );
};
