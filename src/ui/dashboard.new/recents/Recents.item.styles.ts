import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    icon: {
      width: "15px",
    },
    listItem: {
      paddingLeft: "1px",
    },
    typography: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 400,
    },
    truncateText: {
      textOverflow: "ellipsis",
      overflow: "auto",
    },
    typographyBold: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 600,
    },
    blackDot: {
      width: "4px",
      height: "4px",
      right: "4px",
      position: "relative",
      background: Colors.black,
    },
    timestampContainer: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "22px",
      color: Colors.font_gray,
    },
    nested: {
      marginLeft: "32px",
      borderLeft: "1px solid #CBD5E0",
      maxWidth: "calc( 100% - 40px)",
      paddingLeft: "25px",
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
    linkText: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 400,
      color: Colors.navy,
    },
    collapsedList: {
      backgroundColor: Colors.sky_blue,
    },
  })
);
