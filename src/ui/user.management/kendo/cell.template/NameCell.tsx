import { TextField } from "@material-ui/core";
import React from "react";

export const NameCell = (props) => {
  const updateNameField = (event: any) => {
    props.dataItem.name = event?.target?.value;
  };
  if (props.rowType === "groupHeader") {
    return null;
  }
  return (
    <td
      colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      {props.dataItem.inEdit ? (
        <TextField
          id="input-with-icon-textfield"
          variant="outlined"
          margin="dense"
          onChange={updateNameField}
        />
      ) : (
        <span>{props.dataItem.user ? props.dataItem.user.name : props.dataItem.items[0]?.user?.name}</span>
      )}
    </td>
  );
};
