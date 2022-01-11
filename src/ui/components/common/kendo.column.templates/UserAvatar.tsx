import { Avatar, Box } from "@material-ui/core";
import { GridCellProps } from "@progress/kendo-react-grid";
import { get } from "lodash";
import React from "react";
import { getInitalsFromName } from "../../icons/avatar/helpers";
import Tooltip from "../kendo/Tooltip";
import { styles } from "./UserAvatar.style";

export const UserAvatar = ({
  dataItem,
  field,
  colSpan,
  style,
  className,
  columnIndex,
}: GridCellProps) => {
  const classes = styles();
  const userName = get(dataItem, field || "");
  const userDetails = userName ? get(dataItem, field ? field.replace(".name", "") : "") : undefined;
  const owner = userDetails ? userDetails.name : "";
  const avatar = userDetails ? userDetails.avatar : "";
  if (!owner) {
    return null;
  }
  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      <Box className={classes.avatar}>
        {avatar ?
          <Avatar className={classes.icon} alt={owner} src={avatar} /> :
          <Avatar className={classes.icon}>
            {getInitalsFromName(owner)}
          </Avatar>
        }
        <Tooltip data={owner}/>
      </Box>
    </td>
  );
};
