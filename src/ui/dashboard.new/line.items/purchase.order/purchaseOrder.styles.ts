import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    inline: {
      display: "inline",
    },
    nested: {
      marginLeft: "40px",
      borderLeft: "1px solid #CBD5E0",
      maxWidth: "calc( 100% - 40px)",
      paddingLeft: "25px",
    },
    linkText: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 400,
      color: "#011FBB",
    },
    collapsedList: {
      backgroundColor: Colors.sky_blue,
    },
    icon: {
      width: "10px",
    },
    listItemIcon: {
      paddingLeft: "5px",
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
    typography: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 400,
    },
    typographyBold: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 600,
    },
    typographyChildrenBold: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 700,
    },
    typographyStatus: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "14px",
      lineHeight: "15px",
    },
    timestampContainer: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "22px",
      color: Colors.font_gray,
    },
    gridContainer: {
      paddingLeft: "14px",
      maxWidth: "calc(100% - 14px)",
    },
    truncateText: {
      textOverflow: "ellipsis",
      overflow: "auto",
    },
    grayDot: {
      width: "4px",
      height: "4px",
      right: "4px",
      top: "12px",
      position: "relative",
      background: Colors.font_gray,
    },
  })
);
