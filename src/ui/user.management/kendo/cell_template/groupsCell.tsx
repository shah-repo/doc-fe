import { Typography } from "@material-ui/core";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import KendoGridStyles from "../kendogrid.styles";

export const GroupsCell = (props) => {
  const classes = KendoGridStyles();
  const groups = props.dataItem[props.field]?.map((emp) => emp.name).join(", ");
  const updateGroupField = (event: any) => {
    props.dataItem.groups = event?.target?.value.map((item) => ({
      id: item?.value || "",
    }));
  };
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const defaultGroups = useSelector(userManagementSelectors.getDefaultGroups);

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      data-grid-col-index={props.columnIndex}
      className={classes.groupCell}
    >
      {props.dataItem.inEdit ? (
        <MultiSelect
          data={groupOptions}
          filterable={true}
          onChange={updateGroupField}
          dataItemKey="value"
          textField="label"
          defaultValue={defaultGroups}
        />
      ) : (
        <Typography
          noWrap={false}
          component="span"
          gutterBottom
          className={`${classes.groupCell} ${classes.kGridFont}`}
        >
          {groups}
        </Typography>
      )}
    </td>
  );
};
