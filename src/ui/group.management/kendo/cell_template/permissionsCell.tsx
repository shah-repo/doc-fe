import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { toOptions } from "../../utils/transform";

export const PermissionsCell = (props) => {
  const currentEmployeePermissions = useSelector(
    authSelectors.currentEmployeePermissions,
  );
  const permissions = props.dataItem[props.field]?.map((perm) => perm);
  const updatePermissionField = (event: any) => {
    props.dataItem.permissions = event?.target?.value.map((e) => e.value);
  };

  // useEffect(() => {
  //   if (props.dataItem.inEdit) {


  //   }
  // }, [props.isOfficial]);


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
        <span>{permissions}</span>
      )}
    </td>
  );
};
