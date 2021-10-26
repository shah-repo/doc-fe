import { createStyles, Theme } from "@material-ui/core";
import Colors from "../../../../../layout/theme/utils/colors";


export default (theme: Theme) =>
  createStyles({
    container: {
      display: "inline-block",
    },
    modeltitle: {
      position: "static",
      width: "194.98px",
      height: "18px",
      left: "calc(50% - 194.98px/2 - 107.51px)",
      top: "calc(50% - 18px/2)",

      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "14px",
      lineHeight: "18px",
      /* identical to box height */

      display: "flex",
      alignItems: "center",

      /* Font Black */

      // color: Colors.font_black,
      color: "#080B11",
    },
    closemodel: {
      left: "20.55%",
      right: "0%",
      bottom: "22.15%",
      fontSize: "1rem",
    },
    pendingBox: {
      flexDirection: "column",
      height: "auto",
      overflowY: "auto",
      top: "48px",
      left: "20px",
      // width: "410px",
      border: "1px solid #F5F8FF",
      display: "flex",
      padding: "20px",
      backgroundColor: "#FFF",
      boxSizing: "border-box",
      alignItems: "flex-start",
      borderRadius: "8px",
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "15px 20px",

      position: "relative",
      // width: "450px",
      // height: "548px",
      top: "12.5%",
      // left: "35.5%",

      /* Highlight */

      background: Colors.sky_blue,
      borderRadius: "8px",

      // position: "absolute",
      // width: 460,
      // height: 560,
      // backgroundColor: Colors.background_gray,
      // boxShadow: theme.shadows[5],
      // padding: theme.spacing(2, 4, 3),
      // top: `50%`,
      // left: `50%`,
      // transform: `translate(-50%, -50%)`,
    },
  });
