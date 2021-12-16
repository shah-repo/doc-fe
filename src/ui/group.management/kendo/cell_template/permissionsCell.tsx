import { Typography } from "@material-ui/core";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { StyledTooltip } from "../../../dashboard.new/line.items/common/StyledTooltip";
import { toOptions } from "../../utils/transform";
import KendoGridStyles from "../kendogrid.styles";

export const PermissionsCell = (props) => {
  const classes = KendoGridStyles();
  const currentEmployeePermissions = useSelector(
    authSelectors.currentEmployeePermissions,
  );
  const permissions = props.dataItem[props.field];
  const updatePermissionField = (event: any) => {
    props.dataItem.permissions = event?.target?.value.map((e) => e.value);
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
          data={toOptions(currentEmployeePermissions)}
          filterable={true}
          onChange={updatePermissionField}
          dataItemKey="value"
          textField="label"
        />
      ) : (
        <StyledTooltip interactive={true}
          title={
            <Typography>
              <div className={`${classes.tooltipHeight}`}>
                {permissions?.replace(/,/g, ",\n")}
              </div>
            </Typography>
          } placement="left" arrow>
          <span>{permissions}</span>
        </StyledTooltip>
      )}
    </td>
  );
};
