import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    listRoot: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      padding: "0px 5px",
      overflow: "auto",
      height: "calc(100vh - 423px)",
    },
    lineItemContent: {
      height: "100px",
    },
  })
);
