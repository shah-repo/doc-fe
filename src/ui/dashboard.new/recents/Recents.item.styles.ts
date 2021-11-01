import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    link: {
      color: Colors.black,
    },
    truncateText: {
      textOverflow: "ellipsis",
      overflow: "auto",
      paddingTop: "1px",
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
    blackDot: {
      width: "4px",
      height: "4px",
      right: "4px",
      position: "relative",
      background: Colors.black,
    },
  })
);
