import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    headerButton: {
      "alignItems": "baseline",
      "width": "100%",
      "boxShadow": "none",
      "textTransform": "none",
      "padding": 0,
      "margin": 0,
      "&:hover": {
        background: "none",
        boxShadow: "none",
      },
    },
    bottomPush: {
      paddingBottom: 10,
      marginRight: 11,
      marginLeft: 5,
    },
    emailPosition: {
      flexFlow: "nowrap",
      display: "flex",
      position: "relative",
      width: "100%",
    },
    emailStyle: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "11px",
      lineHeight: "14px",
      color: "#FFFFFF",
    },
    nameStyle: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "12px",
      lineHeight: "15px",
      color: "#FFFFFF",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "8rem",
    },
  });
