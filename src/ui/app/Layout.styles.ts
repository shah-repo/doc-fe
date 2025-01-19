import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../layout/theme-next';
import { NextTheme } from '../layout/theme-next/provider';
import { HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from './Header.styles';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from './Navigation.styles';

export default makeStyles<NextTheme>(theme => createStyles({
  root: {
    position: 'fixed',
    top: HEADER_HEIGHT,
    right: 0,
    bottom: 0,
    left: SIDEBAR_COLLAPSED_WIDTH,
    backgroundColor: Colors.background,

    [theme.media.mobile]: {
      top: MOBILE_HEADER_HEIGHT,
      left: 0,
      transition: theme.transitions.create('transform', { duration: 200 }),
      willChange: 'transform',
    },
  },
  withSidebarExpanded: {
    left: SIDEBAR_WIDTH,

    [theme.media.mobile]: {
      left: 0,
      transform: `translateX(${SIDEBAR_WIDTH}px)`,
    },
  },
  fullWidth: {
    left: 0,
    transform: 'none',
  },
}));
