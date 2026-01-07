import { createStyles, makeStyles, Theme } from '@material-ui/core';

export default makeStyles((theme: Theme) =>
  createStyles({
    inlineStyle: {
      display: 'inline-block',
      width: 'calc(33.333% - 12px)',
      marginRight: theme.spacing(1.5),
    },
  }),
);
