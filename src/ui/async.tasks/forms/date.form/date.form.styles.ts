import { createStyles, makeStyles } from '@material-ui/core';

export const styles = makeStyles((theme) =>
  createStyles({
    root: {
      overflow: 'auto',
      margin: theme.spacing(1),
    },
  }),
);
