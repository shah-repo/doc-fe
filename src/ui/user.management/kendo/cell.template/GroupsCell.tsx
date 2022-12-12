import { filterBy } from "@progress/kendo-data-query";
import {
  MultiSelect,
  MultiSelectChangeEvent,
  MultiSelectFilterChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { GridCellProps } from "@progress/kendo-react-grid";
import { filter, map } from "lodash";
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
import ExpandableTemplate from "../../../components/common/kendo/ExpandableTemplate";
import { AddUserManage } from "../types";
import { styles } from "./styles";

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

interface GroupsProps extends GridCellProps {
  updatedGridData?: AddUserManage;
}

export const GroupsCell = ({
  dataItem,
  rowType,
  colSpan,
  columnIndex,
  updatedGridData,
}: GroupsProps) => {
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const defaultGroups = useSelector(userManagementSelectors.getDefaultGroups);
  const classes = styles();
  const [result, setResult] = React.useState<GroupOptions[]>([]);
  const [data, setData] = React.useState<GroupOptions[]>([]);

  React.useEffect(() => {
    const upDatedGroupIds = map(updatedGridData?.groups, "id");
    const selectedGroups = filter(groupOptions, (o) => upDatedGroupIds.includes(o.value));
    setData(groupOptions);
    if (selectedGroups.length) {
      setResult(selectedGroups as any);
    } else {
      setResult(defaultGroups);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupOptions, defaultGroups, dataItem.id]);

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
      id="kendo-expandable-column"
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
        <ExpandableTemplate items={dataItem.groups.split(",")} dataId={`${dataItem.id}-${columnIndex}`} />
      )}
    </td>
  );
};
