import { Typography } from "@material-ui/core";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import { StyledTooltip } from "../../../dashboard.new/line.items/common/StyledTooltip";

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
        <StyledTooltip interactive={true}
          title={
            <Typography><div style={{ whiteSpace: "pre-line" }}>{parents?.replace(/,/g, ",\n")}</div></Typography>
          } placement="left-start" arrow>
          <span>{parents}</span>
        </StyledTooltip>
      )}
    </td>
  );
};
