import { TextField } from "@material-ui/core";
import React from "react";
import Tooltip from "../../../components/common/kendo/Tooltip";

export const NameCell = (props) => {
  const [name, setName] = React.useState("");
  const updateNameField = (event: any) => {
    setName(event?.target?.value);
    props.dataItem.name = event?.target?.value;
  };

  if (props.rowType === "groupHeader") {
    return null;
  }

  return (
    <>
      {!props.dataItem.inEdit && (
        <td
          colSpan={props.colSpan}
          style={props.style}
          role="gridcell"
          className={props.className}
          data-grid-col-index={props.columnIndex}
        >
          <Tooltip data ={props.dataItem.name}/>
        </td>
      )}
      {props.dataItem.inEdit && (
        <td
          colSpan={props.colSpan}
          style={props.style}
          role="gridcell"
          className={props.className}
          data-grid-col-index={props.columnIndex}
        >

          <TextField
            id="input-with-icon-textfield"
            variant="outlined"
            margin="dense"
            value={name}
            onChange={updateNameField}
          />
        </td>
      )}
    </>
  ); };
