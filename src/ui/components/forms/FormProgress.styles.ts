import { createStyles, Theme } from '@material-ui/core';

export default (theme: Theme) =>
  createStyles({
    progress: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      minWidth: 150,
    },
    progressAttached: {
      position: 'absolute',
      left: 10,
      right: 10,
      bottom: 10,
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  });
