import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
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
  });
