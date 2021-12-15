import { Avatar, Box, makeStyles } from "@material-ui/core";
import { get } from "lodash";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";
import { getInitalsFromName } from "../../icons/avatar/helpers";

export const UserAvatar = (props) => {
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

  const userName = get(props.dataItem, props.field);
  const userDetails = userName ? get(props.dataItem, props.field.replace(".name", "")) : undefined;
  const owner = userDetails ? userDetails.name : "";
  const avatar = userDetails ? userDetails.avatar : "";


  if (owner) {
    return (
      <td
        colSpan={props.colSpan}
        role="gridcell"
        aria-colindex={props.ariaColumnIndex}
        aria-selected="false"
        data-grid-col-index={props.columnIndex}
      >
        <Box className={classes.avatar}>
          {avatar ?
            <Avatar className={classes.icon} alt={owner} src={avatar} /> :
            <Avatar className={classes.icon}>
              {getInitalsFromName(owner)}
            </Avatar>
          }
          {owner}
        </Box>
      </td>
    );
  }
  return null;
};
