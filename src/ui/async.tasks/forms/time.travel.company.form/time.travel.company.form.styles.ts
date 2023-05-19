import { createStyles, makeStyles } from '@material-ui/core';

export const styles = makeStyles((theme) =>
  createStyles({
    root: {
      overflow: 'auto',
    },
    grid: {
      marginTop: theme.spacing(0.5),
    },
  })
);
