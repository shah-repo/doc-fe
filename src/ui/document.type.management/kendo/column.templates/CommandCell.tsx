import { IconButton, makeStyles } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/Edit";
// import { GridCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import Tooltip from "../../../components/common/kendo/Tooltip";
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
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const { dataItem } = props;
  const inEdit = dataItem[getTranslatedText(TranslatedText[DisplayText.INEDIT])];
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
      <Tooltip
        placement="top"
        data={getTranslatedText("common.add.document.type")}
        childrenElement={
          <span>
            <IconButton
              disableFocusRipple
              disableRipple
              style={{ backgroundColor: "transparent", padding: 5 }}
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
          </span>
        }
      />
      <Tooltip
        placement="top"
        data={getTranslatedText("common.discard")}
        childrenElement={
          <span>
            <IconButton
              disableFocusRipple
              disableRipple
              disabled={props.disabled}
              style={{ backgroundColor: "transparent", padding: 5 }}
              onClick={() => props.cancel(dataItem)}
            >
              <CancelOutlinedIcon
                className={props.disabled ? "" : classes.Cancel}
                fontSize="small"
                color={props.disabled ? "disabled" : "secondary"}
              />
            </IconButton>
          </span>
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
        data={getTranslatedText("common.edit.document.type")}
        childrenElement={
          <span>
            <IconButton
              disableFocusRipple
              disableRipple
              disabled={props.disabled}
              style={{ backgroundColor: "transparent", padding: 5 }}
              onClick={() => props.edit(dataItem)}
            >
              <EditIcon
                className={props.disabled ? "" : classes.ButtonColor}
                fontSize="small"
                color={props.disabled ? "disabled" : "secondary"}
              />
            </IconButton>
          </span>
        }
      />
      <Tooltip
        placement="top"
        data={getTranslatedText("common.delete.document.type")}
        childrenElement={
          <span>
            <IconButton
              disableFocusRipple
              disableRipple
              disabled={props.disabled}
              style={{ backgroundColor: "transparent", padding: 5 }}
              onClick={() => props.remove(dataItem)}
            >
              <DeleteIcon
                className={props.disabled ? "" : classes.Remove}
                fontSize="small"
                color={props.disabled ? "disabled" : "secondary"}
              />
            </IconButton>
          </span>
        }
      />
    </td>
  );
};
