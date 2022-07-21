import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    inline: {
      display: "inline",
    },
    actionIcon: {
      paddingLeft: "10px",
    },
    link: {
      color: Colors.black,
    },
    icon: {
      width: "15px",
      cursor: "pointer",
    },
    listItem: {
      paddingLeft: "1px",
      cursor: "unset",
    },
    viewTooltipText: {
      fontWeight: "bold",
      fontSize: "12px",
      lineHeight: "15px",
    },
    nested: {
      marginLeft: "32px",
      borderLeft: `1px solid ${Colors.light_gray_blue}`,
      maxWidth: "calc( 100% - 40px)",
      paddingLeft: "25px",
      cursor: "unset",
    },
    customTooltipWidth: {
      maxWidth: 500,
    },
    collapsedList: {
      backgroundColor: Colors.sky_blue,
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
      width: "112px",
      height: "58px",
      right: "0px",
      top: "0px",
      /* Highlight */
      background: Colors.sky_blue,
    },
    cursorPointer: {
      cursor: "pointer",
    },
    typography: {
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: 0,
    },
    avatar: {
      width: "30px",
      height: "30px",
      fontSize: "12px",
      color: Colors.white,
      fontWeight: 600,
      textTransform: "uppercase",
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
    grayDot: {
      width: "4px",
      height: "4px",
      right: "4px",
      marginLeft: "4px",
      marginRight: "5px",
      position: "relative",
      background: Colors.font_gray,
    },
    margin5: {
      marginRight: "5px",
    },
    margin7: {
      marginRight: "7px",
    },
  })
);
