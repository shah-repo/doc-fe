import { filterBy } from "@progress/kendo-data-query";
import {
  MultiSelect,
  MultiSelectChangeEvent,
  MultiSelectFilterChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { useSelector } from "react-redux";
import {
  Group,
  GroupTag,
  GroupType,
  Permission,
} from "../../../../state/ducks/auth/types";
import { Nullable } from "../../../../state/ducks/common/types";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Tooltip from "../../../components/common/kendo/Tooltip";
import KendoGridStyles from "../styles";

interface GroupOptions {
  label: string;
  text: string;
  value: string;
  tags: Nullable<GroupTag[]>;
  type?: GroupType;
  defaultForNewUsers: boolean;
  permissions: Permission[];
  parents: Group[];
  joinedParents: Group[];
  isOfficial: boolean;
}

export const GroupsCell = ({
  dataItem,
  rowType,
  colSpan,
  columnIndex,
}: GridCellProps) => {
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const defaultGroups = useSelector(userManagementSelectors.getDefaultGroups);
  const classes = KendoGridStyles();
  const [result, setResult] = React.useState<GroupOptions[]>([]);
  const [data, setData] = React.useState<GroupOptions[]>([]);

  React.useEffect(() => {
    setData(groupOptions);
    setResult(defaultGroups);
  }, [groupOptions, defaultGroups]);

  const updateGroupField = ({ target }: MultiSelectChangeEvent) => {
    dataItem.groups = target.value.map((item) => ({
      id: item.value || "",
    }));
    setResult(target.value);
  };

  const filterChange = ({ filter }: MultiSelectFilterChangeEvent) => {
    const allData = groupOptions.slice();
    const newData = filterBy(allData, filter);
    setData(newData);
  };

  if (rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      role="gridcell"
      data-grid-col-index={columnIndex}
      className={classes.groupCell}
    >
      {dataItem.inEdit ? (
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
        <Tooltip data={dataItem.groups} />
      )}
    </td>
  );
};
