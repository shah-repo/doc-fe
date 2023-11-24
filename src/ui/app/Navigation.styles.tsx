import { createStyles } from '@material-ui/core';
import { NextTheme } from '../layout/theme-next/provider';
import Colors from '../layout/theme/utils/colors';

export const DRAWER_WIDTH = 240;

export const MOBILE_DRAWER_WIDTH = 235;

export default (theme: NextTheme) =>
  createStyles({
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
      background: Colors.mirage,
      zIndex: 20,
      overflow: 'hidden',
      borderRight: 'none',
    },
    drawerOpen: {
      width: DRAWER_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: 0,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: 0,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
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
      drawerClose: {
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: 0,
        }),
        overflowX: 'hidden',
        width: theme.spacing(0),
        display: 'none',
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
  });
