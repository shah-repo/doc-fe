import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';
import { NextTheme } from '../../layout/theme-next/provider';
// @ts-ignore
export default makeStyles((theme: NextTheme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(1),
  },
  tabs: {
    flexGrow: 1,
    overflow: 'auto',
  },
  tabItemIcon: {
    '& path': {
      fill: Colors.textGray,
    },
  },
  tabItemIconActive: {
    '& path': {
      fill: Colors.textBlack,
    },
  },
  tabItemTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 400,
    letterSpacing: 0.25,
  },
  tabItemTitleActive: {
    fontWeight: 600,
  },
  tabItemCount: {
    fontSize: 14,
    fontWeight: 400,
    marginLeft: 5,
  },
  [theme.media.mobile]: {
    mobileTab: {
      display: 'none',
    },
    tabs: {
      overflowX: 'hidden',
    },
  },
}));
