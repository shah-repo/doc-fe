import { createStyles, makeStyles, Theme } from '@material-ui/core';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      overflow: 'hidden',
      padding: theme.spacing(2, 0, 1),
      flexDirection: 'column',
      flexWrap: 'nowrap',
    },
    grid: {
      'flexGrow': 1,
      'overflow': 'auto',
      'padding': theme.spacing(2),
      '& .MuiFormHelperText-root': {
        lineHeight: 1.35,
        paddingLeft: theme.spacing(4),
      },
    },
    actions: {
      padding: theme.spacing(.5, 1, 0),
    },
  }),
);
