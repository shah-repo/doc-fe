import { IconButton, makeStyles } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import EditIcon from "@material-ui/icons/Edit";
import * as React from "react";
import { useIntl } from "react-intl";
import Tooltip from "../../../components/common/kendo/Tooltip";
import Colors from "../../../layout/theme/utils/colors";

export const CommandCell = (props) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
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
  const inEdit = dataItem.inEdit;

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
      <Tooltip
        placement="top"
        data={getTranslatedText("common.add.group")}
        childrenElement={
          <IconButton
            disableRipple={true}
            size="small"
            onClick={() => props.update(dataItem)}
            className={classes.button}
          >
            <AddCircleOutlineIcon
              className={classes.ButtonColor}
              fontSize="small"
            />
          </IconButton>
        }
      />
      <Tooltip
        placement="top"
        data={getTranslatedText("common.discard")}
        childrenElement={
          <IconButton
            disableRipple={true}
            size="small"
            onClick={() => props.cancel(dataItem)}
            className={classes.button}
          >
            <CancelOutlinedIcon className={classes.Cancel} fontSize="small" />
          </IconButton>
        }
      />
    </td>
  ) : (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      className={props.className}
      data-grid-col-index={props.columnIndex}
    >
      <Tooltip
        placement="top"
        data={getTranslatedText("common.edit.group")}
        childrenElement={
          <IconButton
            disableRipple={true}
            size="small"
            onClick={() => props.edit(dataItem)}
            className={classes.button}
          >
            <EditIcon className={classes.ButtonColor} fontSize="small" />
          </IconButton>
        }
      />
    </td>
  );
};
