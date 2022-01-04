import { IconButton, makeStyles, Typography } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import EditIcon from "@material-ui/icons/Edit";
import { GridFilterCellProps } from "@progress/kendo-react-grid";
import * as React from "react";
import { StyledTooltip } from "../../../dashboard.new/line.items/common/StyledTooltip";
import Colors from "../../../layout/theme/utils/colors";

interface CommandCellProps {
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
    tooltip: {
      maxHeight: "100px",
      overflow: "auto",
      fontFamily: "Sora",
      fontSize: 12,
      whiteSpace: "pre-line",
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
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      <StyledTooltip
        interactive={true}
        title={
          <Typography className={`${classes.tooltip}`}>
            {"Add Employee"}
          </Typography>
        }
        placement="top"
        arrow
      >
        <IconButton
          disableRipple={true}
          aria-label="update"
          size="small"
          onClick={() => props.add(dataItem)}
          className={classes.button}
        >
          <AddCircleOutlineIcon
            className={classes.ButtonColor}
            fontSize="small"
          />
        </IconButton>
      </StyledTooltip>
      <StyledTooltip
        interactive={true}
        title={
          <Typography className={`${classes.tooltip}`}>{"Discard"}</Typography>
        }
        placement="top"
        arrow
      >
        <IconButton
          disableRipple={true}
          aria-label="cancel"
          size="small"
          onClick={() => props.cancel(dataItem)}
          className={classes.button}
        >
          <CancelOutlinedIcon className={classes.Cancel} fontSize="small" />
        </IconButton>
      </StyledTooltip>
    </td>
  ) : (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      <StyledTooltip
        interactive={true}
        title={
          <Typography className={`${classes.tooltip}`}>
            {"Edit Employee"}
          </Typography>
        }
        placement="top"
        arrow
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
      </StyledTooltip>
    </td>
  );
};
