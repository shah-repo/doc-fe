import { IconButton, makeStyles } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import EditIcon from "@material-ui/icons/Edit";
import * as React from "react";
import Colors from "../../../layout/theme/utils/colors";

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
  const inEdit = dataItem[props.editField];

  return inEdit ? (
    <td className="k-command-cell">
      <IconButton
        aria-label="update"
        onClick={() => props.add(dataItem)}
      ><AddCircleOutlineIcon className={classes.ButtonColor} fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="cancel"
        onClick={() => props.cancel(dataItem)}
      ><CancelOutlinedIcon className={classes.Cancel} fontSize="small" />
      </IconButton>
      {/* <button
        className="k-button k-grid-save-command"
        onClick={() => props.add(dataItem)}
      >
        Update
      </button>
      <button
        className="k-button k-grid-cancel-command"
        onClick={() => props.cancel(dataItem)}
      >
        Cancel
      </button> */}
    </td>
  ) : (
    <td className="k-command-cell">
      <IconButton
        aria-label="edit"
        onClick={() => props.edit(dataItem)}
      ><EditIcon className={classes.ButtonColor} fontSize="small" />
      </IconButton>
    </td>
  );
};
