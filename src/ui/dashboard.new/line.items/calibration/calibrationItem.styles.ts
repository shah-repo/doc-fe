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
    link: {
      color: Colors.black,
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
