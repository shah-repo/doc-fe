import { createStyles, Theme } from '@material-ui/core';
import Colors from '../layout/theme/utils/colors';

export const DRAWER_WIDTH = 240;

export default (theme: Theme) =>
  createStyles({
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
      background: Colors.mirage,
      zIndex: theme.zIndex.drawer + 2,
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
      marginBottom: theme.spacing(3.75),
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
      marginTop: 15,
      marginLeft: 59,
    },
    shiftIcon: {
      position: 'absolute',
      marginTop: 25,
      marginLeft: 222,
    },
    leftSideIcon: {
      color: Colors.dark_gray2,
      width: 30,
      height: 30,
      boxShadow: '4px 4px 8px 0px #979EC71A',
      position: 'fixed',
    },
    userInfo: {
      height: 55,
    },
  });
