import { IconButton, makeStyles } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import EditIcon from "@material-ui/icons/Edit";
import * as React from "react";
import { useIntl } from "react-intl";
import Tooltip from "../../../components/common/kendo/Tooltip";
import Colors from "../../../layout/theme/utils/colors";
import { UserManage } from "../types";

interface CommandCellProps {
  dataItem: UserManage;
  editField: string;
  add: (dataItem: UserManage) => void;
  cancel: (dataItem: UserManage) => void;
  edit: (dataItem: UserManage) => void;
  colSpan?: any;
  style?: any;
  ariaColumnIndex?: number;
  className?: string;
  columnIndex?: number;
  role?: string;
  rowType?: string;
}

export const CommandCell = ({
  dataItem,
  editField,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  add,
  cancel,
  edit,
}: CommandCellProps) => {
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
  }));
  const classes = styles();
  const inEdit = dataItem[editField];

  if (rowType === "groupHeader") {
    return null;
  }

  return inEdit ? (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      <Tooltip
        placement="top"
        data={getTranslatedText("user.management.add.employee")}
        childrenElement={
          <IconButton
            disableRipple={true}
            size="small"
            onClick={() => add(dataItem)}
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
            onClick={() => cancel(dataItem)}
            className={classes.button}
          >
            <CancelOutlinedIcon className={classes.Cancel} fontSize="small" />
          </IconButton>
        }
      />
    </td>
  ) : (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      <Tooltip
        placement="top"
        data={getTranslatedText("user.management.edit.employee")}
        childrenElement={
          <IconButton
            disableRipple={true}
            size="small"
            onClick={() => edit(dataItem)}
            className={classes.button}
          >
            <EditIcon className={classes.ButtonColor} fontSize="small" />
          </IconButton>
        }
      />
    </td>
  );
};
