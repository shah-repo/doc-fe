import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    content: {
      overflowY: "auto",
      marginBottom: theme.spacing(4),
    },
  })
);
