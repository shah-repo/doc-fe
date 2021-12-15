import { IconButton } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import EditIcon from "@material-ui/icons/Edit";
import * as React from "react";

export const CommandCell = (props) => {
  const { dataItem } = props;
  const inEdit = dataItem[props.editField];

  return inEdit ? (
    <td className="k-command-cell">
      <IconButton
        aria-label="update"
        onClick={() => props.add(dataItem)}
      ><AddCircleOutlineIcon color="primary" fontSize="default" />
      </IconButton>
      <IconButton
        aria-label="cancel"
        onClick={() => props.cancel(dataItem)}
      ><CancelOutlinedIcon color="primary" fontSize="default" />
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
      ><EditIcon color="primary" fontSize="default" />
      </IconButton>
    </td>
  );
};
