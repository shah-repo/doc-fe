import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    removeButton: {
      color: theme.palette.primary.main,
      marginLeft: theme.spacing(0.5),
      cursor: "pointer",
    },
  }));
