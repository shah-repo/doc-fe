import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      height: "90vh",
      overflow: "auto",
      margin: "auto",
      maxWidth: 1024,
      width: "100%",
    },
  });
