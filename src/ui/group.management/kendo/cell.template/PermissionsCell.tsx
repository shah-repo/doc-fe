import { MultiSelect, MultiSelectChangeEvent } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import Tooltip from "../../../components/common/kendo/Tooltip";
import { toOptions } from "../../utils/transform";

interface PermissionCellProps {
  dataItem: any;
  rowType?: string;
  colSpan?: number | undefined;
  style?: any;
  className?: string;
  columnIndex?: number;
  field?: string;
  isOfficial: boolean;
}

export const PermissionsCell = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  isOfficial,
  field,
}: PermissionCellProps) => {
  const currentEmployeePermissions = useSelector(
    authSelectors.currentEmployeePermissions,
  );
  const permissions = dataItem[field || ""];
  const updatePermissionField = ({ target }: MultiSelectChangeEvent) => {
    dataItem.permissions = target?.value.map((e) => e.value);
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
          data={toOptions(currentEmployeePermissions)}
          filterable={true}
          onChange={updatePermissionField}
          dataItemKey="value"
          textField="label"
        />
      ) : (
        <Tooltip data={permissions} />
      )}
    </td>
  );
};
