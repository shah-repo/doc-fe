import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles((theme) =>
  createStyles({
    root: {
      overflow: "auto",
    },
    mt8: {
      marginTop: theme.spacing(1),
    },
  })
);
