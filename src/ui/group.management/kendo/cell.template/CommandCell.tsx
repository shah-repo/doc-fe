import { IconButton, makeStyles } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import EditIcon from "@material-ui/icons/Edit";
import * as React from "react";
import Colors from "../../../layout/theme/utils/colors";

export const CommandCell = (props) => {
  const styles = makeStyles(() => ({
    button: {
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
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
        disableRipple={true}
        aria-label="add"
        size="small"
        onClick={() => props.update(dataItem)}
        className={classes.button}
      >
        <AddCircleOutlineIcon
          className={classes.ButtonColor}
          fontSize="small"
        />
      </IconButton>
      <IconButton
        disableRipple={true}
        aria-label="cancel"
        size="small"
        onClick={() => props.cancel(dataItem)}
        className={classes.button}
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
        disableRipple={true}
        aria-label="edit"
        size="small"
        onClick={() => props.edit(dataItem)}
        className={classes.button}
      >
        <EditIcon className={classes.ButtonColor} fontSize="small" />
      </IconButton>
    </td>
  );
};
