import { TextField } from "@material-ui/core";
import React from "react";

export const NameCell = (props) => {

  const updateNameField = (event: any) => {
    props.dataItem.name = event?.target?.value;
  };
  return (
    <>
      {!props.dataItem.inEdit && (
        <td
          colSpan={props.colSpan}
          role="gridcell"
          aria-colindex={props.ariaColumnIndex}
          aria-selected="false"
          data-grid-col-index={props.columnIndex}
        >
          <span>{props.dataItem.name}</span>
        </td>
      )}
      {props.dataItem.inEdit && (
        <td
          colSpan={props.colSpan}
          role="gridcell"
          aria-colindex={props.ariaColumnIndex}
          aria-selected="false"
          data-grid-col-index={props.columnIndex}
        >

          <TextField
            id="input-with-icon-textfield"
            variant="outlined"
            margin="dense"
            onChange={updateNameField}
            value={props.dataItem.updatedName}
            defaultValue={props.dataItem.name}
          />
        </td>
      )}
    </>
  ); };
