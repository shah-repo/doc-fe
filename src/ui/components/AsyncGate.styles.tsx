import { createStyles, Theme } from '@material-ui/core';
import Colors from '../layout/theme/utils/colors';

export default (theme: Theme) =>
  createStyles({
    errorContainer: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
    },
    tryAgainButton: {
      marginLeft: theme.spacing(1),
    },
    progress: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    passiveContainer: {
      position: 'relative',
    },
    passiveProgress: {
      width: '100%',
      marginTop: theme.spacing(1),
      position: 'absolute',
      zIndex: 2,
    },
    errorAccessDeniedContainer: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },
    accessDeniedText: {
      marginTop: theme.spacing(2),
      fontWeight: 600,
      fontSize: 21,
    },
    errorText: {
      color: Colors.font_gray,
      maxWidth: 570,
      textAlign: 'center',
    },
  });
