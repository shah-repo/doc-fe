import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Tooltip from "../../../components/common/kendo/Tooltip";

export const ParentsCell = (props) => {
  const parents = props.dataItem[props.field];
  const allGroups = useSelector(userManagementSelectors.getOfficialGroups);
  const availableGroups = allGroups.filter(
    (group) => group.value !== props.dataItem.id
  );
  const updateParentField = (event: any) => {
    props.dataItem.parents = event?.target?.value.map((item) => ({
      id: item?.value || "",
    }));
  };

  if (props.rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      {props.dataItem.inEdit && props.isOfficial ? (
        <MultiSelect
          data={availableGroups}
          filterable={true}
          onChange={updateParentField}
          dataItemKey="value"
          textField="label"
        />
      ) : (
        <Tooltip data={parents} />
      )}
    </td>
  );
};
