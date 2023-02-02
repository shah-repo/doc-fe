import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
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
    passwordInput: {
      height: 40,
      marginTop: "0 !important",
    },
    dropDown: {
      top: "2px !important",
      width: "161px",
      left: "-10px",
    },
  }),
);
