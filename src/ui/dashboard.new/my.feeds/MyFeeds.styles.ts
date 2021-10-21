
import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    noPendingActions: {
      color: "red",
    },
    root: {
      top: 20,
      overflow: "auto",
      minHeight: "calc(100vh - 160px)",
      maxHeight: "calc(100vh - 160px)",
    },
  }
  ));
