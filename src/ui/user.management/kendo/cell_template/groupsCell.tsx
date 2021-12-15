import { Typography } from "@material-ui/core";
import { filterBy } from "@progress/kendo-data-query";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Text from "../../../components/Text";
import { StyleTooltip } from "../../../dashboard.new/line.items/common/StyleTooltip";
import KendoGridStyles from "../kendogrid.styles";

export const GroupsCell = (props) => {
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const defaultGroups = useSelector(userManagementSelectors.getDefaultGroups);
  const classes = KendoGridStyles();
  const [result, setResult] = React.useState([]);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    setData(groupOptions as any);
    setResult(defaultGroups as any);
  }, [groupOptions, defaultGroups]);

  const updateGroupField = (event: any) => {
    props.dataItem.groups = event?.target?.value.map((item) => ({
      id: item?.value || "",
    }));
    setResult(event.target.value);
  };

  const filterChange = (event: any) => {
    const filter = event.filter;
    const allData = groupOptions.slice();
    const newData = filterBy(allData, filter);
    setData(newData as any);
  };

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
          data={data}
          value={result}
          filterable={true}
          onChange={updateGroupField}
          onFilterChange={filterChange}
          dataItemKey="value"
          textField="label"
          defaultValue={defaultGroups}
        />
      ) : (
        <StyleTooltip title={<Typography><Text translation={props.dataItem.groups} /></Typography>} placement="top-start" arrow>
          <Typography noWrap>{props.dataItem.groups}</Typography>
        </StyleTooltip>
      )}
    </td>
  );
};
