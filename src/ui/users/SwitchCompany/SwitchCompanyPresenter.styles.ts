import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: "auto",
      backgroundColor: theme.palette.common.white,
    },
    container: {
      width: "400px",
    },
    title: {
      fontSize: "26px",
    },
    subtitle: {
      fontSize: "16px",
      fontWeight: 300,
    },
  });
