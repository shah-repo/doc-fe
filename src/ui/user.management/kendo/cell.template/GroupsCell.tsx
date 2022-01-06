import { filterBy } from "@progress/kendo-data-query";
import { MultiSelect, MultiSelectChangeEvent, MultiSelectFilterChangeEvent } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { Group, GroupTag, GroupType, Permission } from "../../../../state/ducks/auth/types";
import { Nullable } from "../../../../state/ducks/common/types";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Tooltip from "../../../components/common/kendo/Tooltip";
import { GridCellProperties } from "../../../components/common/kendo/types";
import KendoGridStyles from "../styles";

interface GroupOptions {
  label: string;
  text: string;
  value: string;
  tags: Nullable<GroupTag[]>;
  type: GroupType | undefined;
  defaultForNewUsers: boolean;
  permissions: Permission[];
  parents: Group[];
  joinedParents: Group[];
  isOfficial: boolean;
}

export const GroupsCell = (props: GridCellProperties) => {
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const defaultGroups = useSelector(userManagementSelectors.getDefaultGroups);
  const classes = KendoGridStyles();
  const [result, setResult] = React.useState<GroupOptions[]>([]);
  const [data, setData] = React.useState<GroupOptions[]>([]);

  React.useEffect(() => {
    setData(groupOptions);
    setResult(defaultGroups);
  }, [groupOptions, defaultGroups]);

  const updateGroupField = (event: MultiSelectChangeEvent) => {
    props.dataItem.groups = event.target.value.map((item) => ({
      id: item.value || "",
    }));
    setResult(event.target.value as any);
  };

  const filterChange = (event: MultiSelectFilterChangeEvent) => {
    const filter = event.filter;
    const allData = groupOptions.slice();
    const newData = filterBy(allData, filter);
    setData(newData as any);
  };

  if (props.rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
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
        <Tooltip data={props.dataItem.groups} />
      )}
    </td>
  );
};
