import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    layout: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
  });
