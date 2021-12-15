import { Typography } from "@material-ui/core";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import { StyledTooltip } from "../../../dashboard.new/line.items/common/StyledTooltip";

export const TagsCell = (props) => {
  const tags = props.dataItem[props.field];
  const allGroups = useSelector(userManagementSelectors.getOfficialGroups);
  const availableGroups = allGroups.filter(
    (group) => group.value !== props.dataItem.id
  );
  const joinTag = availableGroups.map((e) => e.tags).join();
  const selectedTags = joinTag.split(",").filter(Boolean);
  const updateTagField = (event: any) => {
    props.dataItem.tags = event?.target?.value;
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
          data={selectedTags}
          filterable={true}
          onChange={updateTagField}
        />
      ) : (
        <StyledTooltip interactive={true}
          title={
            <Typography><div style={{ whiteSpace: "pre-line" }}>{tags?.replace(/,/g, ",\n")}</div></Typography>
          } placement="left-start" arrow>
          <span>{tags}</span>
        </StyledTooltip>
      )}
    </td>
  );
};
