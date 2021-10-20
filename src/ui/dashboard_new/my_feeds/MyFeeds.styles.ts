
import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      overflow: "auto",
      marginTop: "20px",
      minHeight: "calc(100vh - 170px)",
      maxHeight: "calc(100vh - 170px)",
    },
    noPendingActions: {
      color: "red",
    },
    root: {
      width: "100%",
      minHeight: "calc(100vh - 180px)",
      maxHeight: "calc(100vh - 180px)",
    },
    item: {
      width: "100%",
    },
  }
  ));
