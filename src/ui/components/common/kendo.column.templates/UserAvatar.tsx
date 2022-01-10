import { Avatar, Box } from "@material-ui/core";
import { get } from "lodash";
import React from "react";
import { getInitalsFromName } from "../../icons/avatar/helpers";
import Tooltip from "../kendo/Tooltip";
import { GridCellProperties } from "../kendo/types";
import { styles } from "./UserAvatar.style";

export const UserAvatar = (props: GridCellProperties) => {
  const classes = styles();
  const { field } = props;
  const userName = get(props.dataItem, props.field || "");
  const userDetails = userName ? get(props.dataItem, field ? field.replace(".name", "") : "") : undefined;
  const owner = userDetails ? userDetails.name : "";
  const avatar = userDetails ? userDetails.avatar : "";
  if (!owner) {
    return null;
  }
  return (
    <td
      colSpan={props.colSpan}
      style={props.style}
      role="gridcell"
      className={props.className}
      data-grid-col-index={props.columnIndex}
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
