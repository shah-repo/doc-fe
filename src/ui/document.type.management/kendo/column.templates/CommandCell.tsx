import { IconButton, makeStyles } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";

export const CommandCell = (props) => {
  const styles = makeStyles(() => ({
    ButtonColor: {
      color: Colors.navy,
    },
    Cancel: {
      color: Colors.latest_yellow_varient,
    },
    Remove: {
      color: Colors.latest_red_varient,
    },
  }));
  const classes = styles();
  const { dataItem } = props;
  const inEdit = dataItem.inEdit;
  const isNewItem = dataItem.id === undefined;
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
        style={{ backgroundColor: "transparent", padding: 5 }}
        aria-label="add"
        onClick={() => isNewItem ? props.add(dataItem) : props.update(dataItem)}
      >
        <AddCircleOutlineIcon
          className={classes.ButtonColor}
          fontSize="small"
        />
      </IconButton>
      <IconButton
        disableFocusRipple
        disableRipple
        style={{ backgroundColor: "transparent", padding: 5 }}
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
        style={{ backgroundColor: "transparent", padding: 5 }}
        aria-label="edit"
        onClick={() => props.edit(dataItem)}
      >
        <EditIcon className={classes.ButtonColor} fontSize="small" />
      </IconButton>
      {/* TODO: check and put Remove */}
      <IconButton
        disableFocusRipple
        disableRipple
        style={{ backgroundColor: "transparent", padding: 5 }}
        aria-label="cancel"
        onClick={() => props.remove(dataItem)}
      >
        <DeleteIcon className={classes.Remove} fontSize="small" />
      </IconButton>
    </td>
  );
};
