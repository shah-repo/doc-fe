import { IconButton, makeStyles } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/Edit";
// import { GridCellProps } from "@progress/kendo-react-grid";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";
import { CellCommandConfig } from "../types";

export const CommandCell = (props: CellCommandConfig) => {
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
  if (props.rowType === "groupHeader") {
    return null;
  }
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
        disabled={props.disabled}
        onClick={() =>
          isNewItem ? props.add(dataItem) : props.update(dataItem)
        }
      >
        <AddCircleOutlineIcon
          className={props.disabled ? "" : classes.ButtonColor}
          fontSize="small"
          color={props.disabled ? "disabled" : "secondary"}
        />
      </IconButton>
      <IconButton
        disableFocusRipple
        disableRipple
        disabled={props.disabled}
        style={{ backgroundColor: "transparent", padding: 5 }}
        aria-label="cancel"
        onClick={() => props.cancel(dataItem)}
      >
        <CancelOutlinedIcon
          className={props.disabled ? "" : classes.Cancel}
          fontSize="small"
          color={props.disabled ? "disabled" : "secondary"}
        />
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
        disabled={props.disabled}
        style={{ backgroundColor: "transparent", padding: 5 }}
        aria-label="edit"
        onClick={() => props.edit(dataItem)}
      >
        <EditIcon
          className={props.disabled ? "" : classes.ButtonColor}
          fontSize="small"
          color={props.disabled ? "disabled" : "secondary"}
        />
      </IconButton>
      {/* TODO: check and put Remove */}
      <IconButton
        disableFocusRipple
        disableRipple
        disabled={props.disabled}
        style={{ backgroundColor: "transparent", padding: 5 }}
        aria-label="cancel"
        onClick={() => props.remove(dataItem)}
      >
        <DeleteIcon
          className={props.disabled ? "" : classes.Remove}
          fontSize="small"
          color={props.disabled ? "disabled" : "secondary"}
        />
      </IconButton>
    </td>
  );
};
