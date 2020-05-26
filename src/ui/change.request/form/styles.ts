import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    whiteContainer: {
      background: "#fff",
      padding: theme.spacing(0),
      margin: "50px 0 0 10px",
    },
  });
