import { TextField } from "@material-ui/core";
import React from "react";

export const EmailCell = (props) => {
  const updateEmailField = (event: any) => {
    props.dataItem.email = event?.target?.value;
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
          onChange={updateEmailField}
        />
      ) : (
        <span>{props?.dataItem?.user ? props?.dataItem?.user?.email : props?.dataItem?.items[0]?.user?.email}</span>
      )}
    </td>
  );
};
