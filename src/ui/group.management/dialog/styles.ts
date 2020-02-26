import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    closeIcon: {
      color: theme.palette.text.hint,

    },
    title: {
        color: "#474747",
        fontsize: "1.3rem",
    },
  }),
);
