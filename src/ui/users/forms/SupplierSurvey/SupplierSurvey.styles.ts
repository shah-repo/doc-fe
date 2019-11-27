import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: "auto",
      width: "100%",
      position: "absolute",
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.common.white,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      marginBottom: theme.spacing(8),
    },
  }),
);
