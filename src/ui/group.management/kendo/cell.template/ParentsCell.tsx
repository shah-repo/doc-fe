import { MultiSelect, MultiSelectChangeEvent } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Tooltip from "../../../components/common/kendo/Tooltip";

interface ParentCellProps {
  dataItem: any;
  rowType?: string;
  colSpan?: number | undefined;
  style?: any;
  className?: string;
  columnIndex?: number;
  isOfficial: boolean;
  field?: string;
}

export const ParentsCell = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  isOfficial,
  field,
}: ParentCellProps) => {
  const parents = dataItem[field || ""];
  const allGroups = useSelector(userManagementSelectors.getOfficialGroups);
  const availableGroups = allGroups.filter(
    (group) => group.value !== dataItem.id
  );
  const updateParentField = ({ target }: MultiSelectChangeEvent) => {
    dataItem.parents = target?.value.map((item) => ({
      id: item?.value || "",
    }));
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
          data={availableGroups}
          filterable={true}
          onChange={updateParentField}
          dataItemKey="value"
          textField="label"
        />
      ) : (
        <Tooltip data={parents} />
      )}
    </td>
  );
};
