import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    inline: {
      display: "inline",
    },
    avatar: {
      width: "35px",
      height: "35px",
      fontSize: "14px",
      color: Colors.white,
      fontFamily: "Sora",
      fontWeight: 600,
      textTransform: "uppercase",
    },
    actionIcon: {
      paddingLeft: "10px",
    },
    link: {
      color: Colors.black,
    },
    icon: {
      width: "15px",
    },
    listItem: {
      paddingLeft: "1px",
    },
    linkText: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 400,
      color: Colors.navy,
    },
    linkTextColor: {
      color: Colors.navy,
    },
    attachmentIcon: {
      paddingTop: "2px",
    },
    nested: {
      marginLeft: "32px",
      borderLeft: `1px solid ${Colors.light_gray_blue}`,
      maxWidth: "calc( 100% - 40px)",
      paddingLeft: "25px",
    },
    collapsedList: {
      backgroundColor: Colors.sky_blue,
    },
    typographyChildrenBold: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 700,
    },
    gridContainer: {
      paddingLeft: "14px",
      maxWidth: "calc(100% - 14px)",
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
    typography: {
      "fontSize": "14px",
      "fontFamily": "Sora",
      "fontWeight": 400,
      "& > p": { margin: "0px" },
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
  })
);
