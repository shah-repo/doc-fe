import { createStyles, fade, makeStyles } from '@material-ui/core';
import EnlilLogo from '../../assets/images/enlil_logo.svg';
import { Colors } from '../layout/theme-next';
import { GRADIENT } from '../layout/theme-next/consts';
import { NextTheme } from '../layout/theme-next/provider';
import { SIDEBAR_WIDTH } from './Navigation.styles';

export const HEADER_HEIGHT = 40;
export const MOBILE_HEADER_HEIGHT = 52;

export default makeStyles<NextTheme>(theme => createStyles({
  root: {
    position: 'fixed',
    background: `${GRADIENT}`,
    color: Colors.white,
    zIndex: 1,

    [theme.media.mobile]: {
      transition: theme.transitions.create('transform', { duration: 200 }),
      willChange: 'transform',
    },

    '&::before': {
      content: "''",
      position: 'absolute',
      width: '20vw',
      right: 0,
      top: 0,
      bottom: 0,
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${EnlilLogo})`,
      backgroundPosition: 'left top',

      [theme.media.mobile]: {
        display: 'none',
      },
    },
  },
  toolbar: {
    height: HEADER_HEIGHT,
    minHeight: 0,
    paddingBottom: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    background: 'rgba(0, 0, 0, 0.2)',

    [theme.media.mobile]: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
      height: MOBILE_HEADER_HEIGHT,
    },
  },
  menu: {
    marginRight: theme.spacing(1.5),

    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    [theme.media.mobile]: {
      display: 'block',
    },
  },
  menuIcon: {
    width: 16,
    height: 16,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    background: fade(Colors.white, 0.1),
    cursor: 'pointer',
  },
  switch: {
    minWidth: theme.spacing(30),
    marginRight: theme.spacing(2),

    [theme.breakpoints.down('sm')]: {
      minWidth: 0,
    },
    [theme.media.mobile]: {
      flexGrow: 1,
    },
  },
  controls: {
    minWidth: theme.spacing(20),
    marginLeft: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',

    [theme.breakpoints.down('sm')]: {
      minWidth: 0,
    },
  },
  search: {
    padding: theme.spacing(0, 1),

    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  help: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  toggler: {
    marginLeft: 0,
    whiteSpace: 'nowrap',

    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 36,
  },
  company: {
    marginLeft: theme.spacing(1.5),

    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    [theme.media.mobile]: {
      display: 'block',
    },
  },
  companyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 36,
    display: 'block',
  },
  withSidebarExpanded: {
    [theme.media.mobile]: {
      transform: `translateX(${SIDEBAR_WIDTH}px)`,
    },
  },
  [theme.media.mobile]: {
    hideOnMobile: {
      display: 'none',
    },
  },
}));
