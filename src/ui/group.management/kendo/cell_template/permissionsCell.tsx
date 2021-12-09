import { MultiSelect } from "@progress/kendo-react-dropdowns";
import React from "react";

export const PermissionsCell = (props) => {
  const permissions = props.dataItem[props.field]?.map((perm) => perm);

  return (
    <>
      {props.dataItem.inEdit && (
        <td
          colSpan={props.colSpan}
          role="gridcell"
          aria-colindex={props.ariaColumnIndex}
          aria-selected="false"
          data-grid-col-index={props.columnIndex}
        >
          <MultiSelect
            data={permissions}
            filterable={true}
            value={permissions}
          />
        </td>
      )}
      {!props.dataItem.inEdit && (
        <td
          colSpan={props.colSpan}
          role="gridcell"
          aria-colindex={props.ariaColumnIndex}
          aria-selected="false"
          data-grid-col-index={props.columnIndex}
        >
          {permissions}
        </td>
      )}
    </>
  );
};
