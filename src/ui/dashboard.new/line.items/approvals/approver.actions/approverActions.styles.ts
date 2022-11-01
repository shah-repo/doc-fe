import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: Colors.black,
    },
    avatar: {
      width: "30px",
      height: "30px",
      fontSize: "12px",
      fontWeight: 600,
      color: Colors.white,
      textTransform: "uppercase",
    },
    buttoncursor: {
      cursor: "unset",
    },
    actionIcon: {
      paddingLeft: theme.spacing(1.25),
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
    cursorPointer: {
      cursor: "pointer",
    },
    typography: {
      "fontSize": "14px",
      "fontWeight": 400,
      "& > p": { margin: "0px" },
      "letterSpacing": 0,
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
