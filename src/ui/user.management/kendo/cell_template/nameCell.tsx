import { TextField } from "@material-ui/core";
import React from "react";

export const NameCell = (props) => {
  const updateNameField = (event: any) => {
    props.dataItem.name = event?.target?.value;
  };
  return (
    <td
      colSpan={props.colSpan}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
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
