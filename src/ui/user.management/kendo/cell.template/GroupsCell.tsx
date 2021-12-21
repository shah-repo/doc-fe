import { filterBy } from "@progress/kendo-data-query";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Tooltip from "../../../components/common/kendo/Tooltip";
import KendoGridStyles from "../styles";

export const GroupsCell = (props) => {
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const defaultGroups = useSelector(userManagementSelectors.getDefaultGroups);
  const classes = KendoGridStyles();
  const [result, setResult] = React.useState([]);
  const [data, setData] = React.useState([]);

  const processDataByField = (data, field) => data.filter((el) => el[field]).sort((beforeVal, afterVal) =>
    beforeVal[field].trimLeft().trimEnd() > afterVal[field].trimLeft().trimEnd() ? 1 : -1);

  React.useEffect(() => {
    setData(processDataByField(groupOptions, "label"));
    setResult(processDataByField(defaultGroups, "label"));
  }, [groupOptions, defaultGroups]);

  const updateGroupField = (event: any) => {
    props.dataItem.groups = event?.target?.value.map((item) => ({
      id: item?.value || "",
    }));
    setResult(event.target.value);
  };

  const filterChange = (event: any) => {
    const filter = event.filter;
    const allData = processDataByField(groupOptions, "label").slice();
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
          defaultValue={processDataByField(defaultGroups, "label")}
        />
      ) : (
        <Tooltip data={props?.dataItem?.groups} />
      )}
    </td>
  );
};
