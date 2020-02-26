import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      float: "right",
      clear: "right",
    },
    cancelButton: {
      float: "right",
      marginRight: theme.spacing(1),
    },
    dialogPaper: {
      overflowY: "unset",
      minWidth: "400px",
    },
    dialogContent: {
      overflowY: "unset",
    },
  }),
);
