import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles((theme) =>
  createStyles({
    root: {
      overflow: "auto",
      height: "calc(100vh - 130px)",
    },
    grid: {
      marginTop: theme.spacing(0.5),
    },
  })
);
