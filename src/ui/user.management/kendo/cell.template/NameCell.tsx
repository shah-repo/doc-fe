import { TextField } from "@material-ui/core";
import React from "react";
import Tooltip from "../../../components/common/kendo/Tooltip";
import { GridCellProperties } from "../../../components/common/kendo/types";

export const NameCell = (props: GridCellProperties) => {
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
        <Tooltip data ={props.dataItem.user ? props.dataItem.user.name : props.dataItem.items[0]?.user?.name}/>
      )}
    </td>
  );
};
