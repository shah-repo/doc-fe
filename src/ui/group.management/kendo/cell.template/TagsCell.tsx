import { MultiSelect, MultiSelectChangeEvent } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Tooltip from "../../../components/common/kendo/Tooltip";

interface TagsCellProps {
  dataItem: any;
  rowType?: string;
  colSpan?: number | undefined;
  style?: any;
  className?: string;
  columnIndex?: number;
  field?: string;
  isOfficial: boolean;
}

export const TagsCell = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  field,
  isOfficial,
}: TagsCellProps) => {
  const tags = dataItem[field || ""];
  const allGroups = useSelector(userManagementSelectors.getOfficialGroups);
  const availableGroups = allGroups.filter(
    (group) => group.value !== dataItem.id
  );
  const joinTag = availableGroups.map((e) => e.tags).join();
  const selectedTags = joinTag.split(",").filter(Boolean);
  const updateTagField = ({ target }: MultiSelectChangeEvent) => {
    dataItem.tags = target?.value;
  };

  if (rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      {dataItem.inEdit && isOfficial ? (
        <MultiSelect
          data={selectedTags}
          filterable={true}
          onChange={updateTagField}
        />
      ) : (
        <Tooltip data={tags} />
      )}
    </td>
  );
};
