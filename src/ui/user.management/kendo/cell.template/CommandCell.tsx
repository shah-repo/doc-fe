import { IconButton, makeStyles } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import EditIcon from "@material-ui/icons/Edit";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import * as React from "react";
import Colors from "../../../layout/theme/utils/colors";

interface CommandCellProps  {
  dataItem: GridFilterCellProps;
  editField: string;
  add: (dataItem) => void;
  cancel: (dataItem) => void;
  edit: (dataItem) => void;
  colSpan?: any;
  style?: any;
  ariaColumnIndex?: number;
  className?: string;
  columnIndex?: number;
  role?: string;
  rowType?: string;
}

export const CommandCell = (props: CommandCellProps) => {
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
      ><EditIcon className={classes.ButtonColor} fontSize="small" />
      </IconButton>
    </td>
  );
};
