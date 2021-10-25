import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    icon: {
      width: "7px",
    },
    listItemIcon: {
      paddingLeft: "5px",
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
  })
);
