import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
    },
    item: {
      height: "77vh",
      width: "100%",
    },
    link: {
      textDecoration: "none",
    },
    button: {
      margin: "0px",
      boxShadow: "none",
    },
    clearButton: {
      margin: "0px 16px 0px 0px",
      backgroundColor: theme.palette.common.white,
    },
    form: {
      minWidth: 400,
    },
    submitButton: {
      float: "right",
      clear: "right",
    },
    cancelButton: {
      float: "right",
      marginRight: theme.spacing(1),
    },
  }),
);
