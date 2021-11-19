import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    inline: {
      display: "inline",
    },
    nested: {
      marginLeft: "32px",
      borderLeft: `1px solid ${Colors.light_gray_blue}`,
      maxWidth: "calc( 100% - 40px)",
      paddingLeft: "25px",
    },
    customTooltipWidth: {
      maxWidth: 500,
    },
    link: {
      color: Colors.black,
    },
    collapsedList: {
      backgroundColor: Colors.sky_blue,
    },
    icon: {
      width: "15px",
    },
    listItem: {
      paddingLeft: "1px",
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
    viewTooltipText: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "12px",
      lineHeight: "15px",
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
    truncateText: {
      textOverflow: "ellipsis",
      overflow: "auto",
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
