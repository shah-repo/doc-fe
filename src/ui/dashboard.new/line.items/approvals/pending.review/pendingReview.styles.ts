import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: "inline",
    },
    link: {
      color: Colors.black,
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
    icon: {
      width: "15px",
      cursor: "pointer",
    },
    listItem: {
      paddingLeft: "1px",
      cursor: "unset",
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
      background: Colors.sky_blue,
    },
    actionIcon: {
      paddingLeft: theme.spacing(1.25),
    },
    cursorPointer: {
      cursor: "pointer",
    },
    viewTooltipText: {
      fontWeight: "bold",
      fontSize: "12px",
      lineHeight: "15px",
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
    grayDot: {
      width: "4px",
      height: "4px",
      right: "4px",
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
