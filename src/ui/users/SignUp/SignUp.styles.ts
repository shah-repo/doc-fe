import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.grey[300],
    },
    paper: {
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2, 3, 3),
    },
    avatar: {
      backgroundColor: theme.palette.secondary.main,
      margin: theme.spacing(1),
      color: theme.palette.secondary.contrastText,
    },
    form: {
      marginTop: theme.spacing(1),
      width: "100%", // Fix IE 11 issue.
    },
    status: {
      marginTop: theme.spacing(3),
    },
    submit: {
      marginTop: theme.spacing(3),
    },
  }),
  );
