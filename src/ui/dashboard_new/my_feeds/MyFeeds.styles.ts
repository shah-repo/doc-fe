
import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    outline: {
      // border: "1px solid grey",
      overflow: "auto",
      top: "10px",
      minHeight: "calc(100vh - 145px)",
      maxHeight: "calc(100vh - 145px)",
    },
    noPendingActions: {
      color: "red",
    },
    root: {
      width: "100%",
    },
    item: {
      width: "100%",
    },
  }
  ));
