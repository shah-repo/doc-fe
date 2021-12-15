import { Typography } from "@material-ui/core";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Text from "../../../components/Text";
import { StyleTooltip } from "../../../dashboard.new/line.items/common/StyleTooltip";

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

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
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
        <StyleTooltip title={<Typography><Text translation={parents} /></Typography>} placement="top-start" arrow>
          <span>{parents}</span>
        </StyleTooltip>
      )}
    </td>
  );
};
