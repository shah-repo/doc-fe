import { TextField } from "@material-ui/core";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";
import { GRID_COL_INDEX_ATTRIBUTE } from "@progress/kendo-react-grid";
import React from "react";
import Tooltip from "../../../components/common/kendo/Tooltip";

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
        <Tooltip data = {props?.dataItem?.user ? props?.dataItem?.user?.email : props?.dataItem?.items[0]?.user?.email}/>
      )}
    </td>
  );
};
