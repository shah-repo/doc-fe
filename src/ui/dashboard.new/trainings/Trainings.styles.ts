import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    noPendingActions: {
      color: "red",
    },
    root: {
      "overflow": "auto",
      "height": "calc(100vh - 196px)",
      "padding-bottom": 0,
    },
    grid: {
      marginTop: 5,
    },
  })
);
