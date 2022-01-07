import { Avatar, Box, makeStyles } from "@material-ui/core";
import { get } from "lodash";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";
import { getInitalsFromName } from "../../icons/avatar/helpers";
import Tooltip from "../kendo/Tooltip";
import { GridCellProperties } from "../kendo/types";

export const UserAvatar = (props: GridCellProperties) => {
  const styles = makeStyles(() => ({
    icon: {
      width: "25px",
      height: "25px",
      marginRight: 4,
      fontFamily: "Sora",
      fontSize: 12,
      fontWeight: 600,
      color: Colors.white,
      backgroundColor: Colors.grey_cloud,
    },
    avatar: {
      display: "flex",
      flexDirection: "row",
      position: "relative",
      margin: "auto",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      lineHeight: "18px",
      alignItems: "center",
      color: Colors.almost_black,
    },
  }));
  const classes = styles();
  const { field } = props;
  const userName = get(props.dataItem, props.field || "");
  const userDetails = userName ? get(props.dataItem, field ? field.replace(".name", "") : "") : undefined;
  const owner = userDetails ? userDetails.name : "";
  const avatar = userDetails ? userDetails.avatar : "";


  if (owner) {
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
  }
  return null;
};
