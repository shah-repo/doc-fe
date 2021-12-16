import { IconButton, makeStyles } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";

export const CommandCell1 = (props) => {
  const { dataItem } = props;
  const inEdit = dataItem[props.editField];
  const isNewItem = dataItem.id === undefined;
  return inEdit ? (
    // className="k-command-cell"
    <td  colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}>
      <button
        className="k-button k-grid-save-command"
        onClick={() =>
          isNewItem ? props.add(dataItem) : props.update(dataItem)
        }
      >
        {isNewItem ? "Add" : "Update"}
      </button>
      <button
        className="k-button k-grid-cancel-command"
        onClick={() =>
          isNewItem ? props.discard(dataItem) : props.cancel(dataItem)
        }
      >
        {isNewItem ? "Discard" : "Cancel"}
      </button>
    </td>
  ) : (
    <td colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}>
      <button
        className="k-primary k-button k-grid-edit-command"
        onClick={() => props.edit(dataItem)}
      >
        Edit
      </button>
      <button
        className="k-button k-grid-remove-command"
        onClick={() =>
          props.remove(dataItem)
        }
      >
        Remove
      </button>
    </td>
  );
};


// import * as React from "react";

export const CommandCell = (props) => {
  const styles = makeStyles(() => ({
    ButtonColor: {
      color: Colors.navy,
    },
    Cancel: {
      color: Colors.latest_yellow_varient,
    },
  }));
  const classes = styles();
  const { dataItem } = props;
  const inEdit = dataItem.inEdit;

  return inEdit ? (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      <IconButton
        disableFocusRipple
        disableRipple
        style={{ backgroundColor: "transparent" }}
        aria-label="add"
        onClick={() => props.add(dataItem)}
      >
        <AddCircleOutlineIcon
          className={classes.ButtonColor}
          fontSize="small"
        />
      </IconButton>
      <IconButton
        disableFocusRipple
        disableRipple
        style={{ backgroundColor: "transparent" }}
        aria-label="cancel"
        onClick={() => props.cancel(dataItem)}
      >
        <CancelOutlinedIcon className={classes.Cancel} fontSize="small" />
      </IconButton>
    </td>
  ) : (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      <IconButton
        disableFocusRipple
        disableRipple
        style={{ backgroundColor: "transparent" }}
        aria-label="edit"
        onClick={() => props.edit(dataItem)}
      >
        <EditIcon className={classes.ButtonColor} fontSize="small" />
      </IconButton>
      {/* TODO: check and put Remove */}
      <IconButton
        disableFocusRipple
        disableRipple
        style={{ backgroundColor: "transparent" }}
        aria-label="cancel"
        onClick={() => props.remove(dataItem)}
      >
        <CancelOutlinedIcon className={classes.Cancel} fontSize="small" />
      </IconButton>
    </td>
  );
};
