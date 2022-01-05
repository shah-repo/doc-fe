import { IconButton, makeStyles, Typography } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/Edit";
// import { GridCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { StyledTooltip } from "../../../dashboard.new/line.items/common/StyledTooltip";
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
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      <StyledTooltip
        interactive={true}
        title={
          <Typography className={`${classes.tooltip}`}>
            {"Add Document Type"}
          </Typography>
        }
        placement="top"
        arrow
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
            {"Edit Document Type"}
          </Typography>
        }
        placement="top"
        arrow
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
      </StyledTooltip>
      <StyledTooltip
        interactive={true}
        title={
          <Typography className={`${classes.tooltip}`}>
            {"Delete Document Type"}
          </Typography>
        }
        placement="top"
        arrow
      >
        <IconButton
          disableFocusRipple
          disableRipple
          disabled={props.disabled}
          style={{ backgroundColor: "transparent", padding: 5 }}
          aria-label="remove"
          onClick={() => props.remove(dataItem)}
        >
          <DeleteIcon
            className={props.disabled ? "" : classes.Remove}
            fontSize="small"
            color={props.disabled ? "disabled" : "secondary"}
          />
        </IconButton>
      </StyledTooltip>
    </td>
  );
};
