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
        disableRipple={true}
        aria-label="update"
        size="small"
        onClick={() => props.add(dataItem)}
      ><AddCircleOutlineIcon className={classes.ButtonColor} fontSize="small" />
      </IconButton>
      <IconButton
        disableRipple={true}
        aria-label="cancel"
        size="small"
        onClick={() => props.cancel(dataItem)}
      ><CancelOutlinedIcon className={classes.Cancel} fontSize="small" />
      </IconButton>
    </td>
  ) : (
    <td className="k-command-cell">
      <IconButton
        disableRipple={true}
        aria-label="edit"
        size="small"
        onClick={() => props.edit(dataItem)}
      ><EditIcon className={classes.ButtonColor} fontSize="small" />
      </IconButton>
    </td>
  );
};
