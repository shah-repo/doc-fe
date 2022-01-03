import { TextField } from "@material-ui/core";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import { GRID_COL_INDEX_ATTRIBUTE } from "@progress/kendo-react-grid";
import React from "react";

export const EmailCell = (props) => {
  const updateEmailField = (event: any) => {
    props.dataItem.email = event?.target?.value;
  };
  const navigationAttributes = useTableKeyboardNavigation(props.columnIndex);

  if (props.rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      style={props.style}
      colSpan={props.colSpan}
      role={"gridcell"}
      aria-colindex={props.ariaColumnIndex}
      aria-selected={"false"}
      {...{ [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex }}
      {...navigationAttributes}
    >
      {props.dataItem.inEdit ? (
        <TextField
          id="input-with-icon-textfield"
          variant="outlined"
          margin="dense"
          onChange={updateEmailField}
        />
      ) : (
        <span>{props?.dataItem?.user ? props?.dataItem?.user?.email : props?.dataItem?.items[0]?.user?.email}</span>
      )}
    </td>
  );
};
