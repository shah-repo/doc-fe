import { IconButton } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import EditIcon from "@material-ui/icons/Edit";
import * as React from "react";

export const CommandCell = (props) => {
  const { dataItem } = props;
  const inEdit = dataItem.inEdit;

  return inEdit ? (
    <td className="k-command-cell">
      <IconButton
        disableRipple={true}
        aria-label="add"
        onClick={() => props.update(dataItem)}
      ><AddCircleOutlineIcon color="primary" fontSize="large" />
      </IconButton>
      <IconButton
        disableRipple={true}
        aria-label="cancel"
        onClick={() => props.cancel(dataItem)}
      ><CancelOutlinedIcon color="primary" fontSize="large" />
      </IconButton>
    </td>
  ) : (
    <td className="k-command-cell">
      <IconButton
        disableRipple={true}
        aria-label="edit"
        onClick={() => props.edit(dataItem)}
      ><EditIcon color="primary" fontSize="large" />
      </IconButton>
    </td>
  );
};
