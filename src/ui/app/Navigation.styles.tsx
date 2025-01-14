import { createStyles, makeStyles } from '@material-ui/core';
import { NextTheme } from '../layout/theme-next/provider';
import Colors from '../layout/theme/utils/colors';
import { HEADER_HEIGHT } from './Header.styles';

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

export default makeStyles<NextTheme>(theme => createStyles({
  drawer: {
    width: SIDEBAR_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: SIDEBAR_WIDTH,
    background: Colors.mirage,
    zIndex: 20,
    overflow: 'hidden',
    borderRight: 'none',
    top: HEADER_HEIGHT,
    height: 'auto',
    bottom: 0,

    [theme.media.mobile]: {
      zIndex: 0,
    },
  },
  drawerOpen: {
    width: SIDEBAR_WIDTH,
  },
  drawerClose: {
    [theme.breakpoints.up('sm')]: {
      width: SIDEBAR_COLLAPSED_WIDTH,
    },
  },
  root: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    backgroundColor: Colors.mirage,
    marginTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    flexShrink: 0,
  },
  toolbarTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerLink: {
    textDecoration: 'none',
    color: theme.palette.common.white,
  },
  list: {
    flexGrow: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  progress: {
    margin: 'auto',
    marginTop: 16,
  },
  bottom: {
    paddingBottom: 20,
  },
  defaultIcon: {
    position: 'absolute',
    top: 70,
    zIndex: theme.zIndex.drawer + 2,
    cursor: 'pointer',
  },
  icon: {
    position: 'absolute',
    marginTop: theme.spacing(1.875),
    marginLeft: theme.spacing(7.375),
  },
  shiftIcon: {
    position: 'absolute',
    marginTop: theme.spacing(3.125),
    marginLeft: theme.spacing(27.75),
  },
  leftSideIcon: {
    color: Colors.font_gray,
    width: 26,
    height: 26,
    boxShadow: `4px 4px 8px 0px ${Colors.blue_bell}`,
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: `0.2px solid ${Colors.dark_gray2}`,
    borderRadius: '100px',
    background: 'white',

    [theme.media.mobile]: {
      display: 'none',
    },

    '&:hover': {
      background: Colors.dodger_blue,
      color: Colors.white,
      border: `0.2px solid ${Colors.dodger_blue}`,
    },
  },
  userInfo: {
    height: 55,
  },
  [theme.media.mobile]: {
    drawerPaper: {
      top: 0,
    },
    mobileSideMenu: {
      display: 'none',
    },
    shiftIcon: {
      display: 'none',
    },
    list: {
      display: 'none',
    },
  },
}));
