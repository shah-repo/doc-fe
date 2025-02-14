import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';
import { NextTheme } from '../../../../layout/theme-next/provider';

export default makeStyles<NextTheme>(theme => createStyles({
  togglerContainer: {
    padding: theme.spacing(1.25, 0),
    alignItems: 'center',
    borderBottom: `1px solid ${Colors.stroke}`,

    '&:last-child': {
      borderBottom: 'none',
    },
  },
  togglerLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
  },
  subscriptionTitle: {
    color: Colors.textBlack,
    marginBottom: theme.spacing(0.25),
    fontWeight: 600,
    fontSize: 14,
  },
  subscriptionDescription: {
    color: Colors.textGray,
    fontSize: 12,
  },
  subscriptionInfo: {
    lineHeight: 1,
  },
  infoIcon: {
    color: Colors.primaryLight,
    fontSize: 20,
  },
  [theme.media.mobile]: {
    togglerContainer: {
      marginTop: theme.spacing(2.5),
      marginLeft: 0,
      display: 'flex',
      alignItems: 'center',
    },
  },
}));
