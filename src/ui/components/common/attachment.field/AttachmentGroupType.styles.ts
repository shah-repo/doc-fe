import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    Box: {
      minWidth: 150,
      paddingBottom: 25,
      display: "flex",
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    submitButton: {
      float: "right",
      clear: "right",
    },
    closeIcon: {
      fontSize: "inherit",
      color: theme.palette.secondary.light,
    },
    closeRoot: () => ({
      padding: theme.spacing(0.5, 0.5, 0),
      color: theme.palette.secondary.light,
      marginLeft: "auto",
    }),
    headerText: {
      padding: "20px",
    },
    h4: {
      margin: 5,
    },
  }),
);
