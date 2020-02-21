import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    chip: {
        margin: theme.spacing(0, 1, 1, 0),

    },
    grid: {
        marginTop: theme.spacing(32),
    },
  }),
);
