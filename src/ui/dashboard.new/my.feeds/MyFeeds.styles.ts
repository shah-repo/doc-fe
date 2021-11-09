import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    noPendingActions: {
      color: "red",
    },
    root: {
      overflow: "auto",
      maxHeight: "calc(100vh - 185px)",
    },
    grid: {
      marginTop: 5,
    },
  })
);
