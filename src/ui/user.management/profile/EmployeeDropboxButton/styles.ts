import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    button: {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  }),
);
