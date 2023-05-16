import { createStyles, Theme } from '@material-ui/core';

export default (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    boxContainer: {
      minHeight: 'calc(100vh - 105px)',
    },
    previewBox: {
      marginTop: theme.spacing(5),
      paddingLeft: theme.spacing(3),
    },
  });
