import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    inline: {
      display: "inline",
    },
    listItemIcon: {
      paddingLeft: "10px",
    },
    buttoncursor: {
      cursor: "unset",
    },
    actionIcons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: "0px 10px",
      position: "absolute",
      width: "44px",
      height: "62px",
      right: "0px",
      top: "0px",
      background: Colors.sky_blue,
    },
    cursorPointer: {
      cursor: "pointer",
    },
    actionIcon: {
      paddingLeft: "10px",
    },
    link: {
      color: Colors.black,
    },
    typography: {
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: 0,
    },
    typographyBold: {
      fontSize: "14px",
      fontWeight: 600,
      letterSpacing: 0,
    },
    dueOn: {
      fontWeight: "bold",
      fontSize: "13px",
      lineHeight: "16px",
      color: Colors.font_gray,
      letterSpacing: 0,
    },
    timestampContainer: {
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "22px",
      color: Colors.font_gray,
      letterSpacing: 0,
    },
    truncateText: {
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
    grayDot: {
      width: "4px",
      height: "4px",
      marginLeft: "4px",
      marginRight: "5px",
      position: "relative",
      background: Colors.font_gray,
    },
    margin5: {
      marginRight: "5px",
    },
  })
);
