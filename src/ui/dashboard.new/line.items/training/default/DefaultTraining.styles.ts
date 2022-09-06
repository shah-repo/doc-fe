import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: "inline",
    },
    buttoncursor: {
      cursor: "unset",
    },
    listItemIcon: {
      paddingLeft: "10px",
    },
    actionIcons: {
      /* Action Icons */
      /* Auto Layout */
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
      /* Highlight */
      background: "transparent",
    },
    actionIcon: {
      paddingLeft: theme.spacing(1.25),
    },
    cursorPointer: {
      cursor: "pointer",
    },
    typographyDueInfewDays: {
      fontWeight: "bold",
      fontSize: "13px",
      color: Colors.latest_yellow_varient,
      letterSpacing: 0,
    },
    link: {
      color: Colors.black,
    },
    typographyOverdue: {
      fontWeight: "bold",
      fontSize: "13px",
      color: Colors.latest_red_varient,
      letterSpacing: 0,
    },
    typographyAssigned: {
      fontWeight: "bold",
      fontSize: "13px",
      color: Colors.font_gray,
      letterSpacing: 0,
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
    typographyStatus: {
      fontWeight: "bold",
      fontSize: "14px",
      lineHeight: "15px",
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
    redDot: {
      width: "4px",
      height: "4px",
      right: "4px",
      position: "relative",
      background: Colors.latest_red_varient,
    },
    yellowDot: {
      width: "4px",
      height: "4px",
      right: "4px",
      position: "relative",
      background: Colors.latest_yellow_varient,
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
