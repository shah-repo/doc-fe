import { TextField } from "@material-ui/core";
import React from "react";
import Tooltip from "../../../components/common/kendo/Tooltip";
import { GridCellProperties } from "../../../components/common/kendo/types";

export const EmailCell = (props: GridCellProperties) => {
  const updateEmailField = (event: any) => {
    props.dataItem.email = event.target.value;
  };

  if (props.rowType === "groupHeader") {
    return null;
  }

  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      className={props.className}
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
        <Tooltip
          data={
            props.dataItem.user
              ? props.dataItem.user.email
              : props.dataItem.items[0]?.user.email
          }
        />
      )}
    </td>
  );
};
