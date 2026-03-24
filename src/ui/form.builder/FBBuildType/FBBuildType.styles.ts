import { createStyles, makeStyles } from '@material-ui/core';
import { NextTheme } from '../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) =>
  createStyles({
    approvalButtonsContainer: {
      gap: '12px',
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(2),
    },
    warningIcon: {
      width: 24,
      height: 24,
    },
    messageText: {
      whiteSpace: 'pre-wrap',
    },
    buildTypeSwitchTitle: {
      fontWeight: 600,
      marginBottom: 16,
    },
    warningContainer: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    warningIconContainer: {
      flexShrink: 0,
      paddingTop: theme.spacing(0.5),
      marginRight: theme.spacing(2),
    },
    messageContainer: {
      flex: 1,
    },
    buildTypeSwitchHeader: {
      marginBottom: theme.spacing(3),
    },
    buildTypeSwitchValues: {
      display: 'flex',
      alignItems: 'center',
    },
    buildTypeArrow: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  }),
);
