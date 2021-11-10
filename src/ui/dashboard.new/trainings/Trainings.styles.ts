import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    noPendingActions: {
      color: "red",
    },
    root: {
      top: 20,
      overflow: "auto",
      minHeight: "calc(100vh - 160px)",
      maxHeight: "calc(100vh - 160px)",
      marginLeft: "-11px",
    },
  })
);
