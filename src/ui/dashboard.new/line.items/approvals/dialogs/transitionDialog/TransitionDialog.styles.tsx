import { createStyles, Theme } from "@material-ui/core";
import Colors from "../../../../../layout/theme/utils/colors";

export default (theme: Theme) =>
  createStyles({
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
      display: "flex",
      alignItems: "center",
      color: Colors.modal_cancel_color,
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
      border: "1px solid",
      borderColor: Colors.sky_blue,
      display: "flex",
      padding: "20px",
      backgroundColor: Colors.white,
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
      top: "12.5%",
      background: Colors.sky_blue,
      borderRadius: "8px",
    },
    closedDialogueContent: {
      padding: 0,
    },
  });
