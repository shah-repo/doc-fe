import { createStyles, makeStyles } from '@material-ui/core';
import { NextTheme } from '../layout/theme-next/provider';
import Colors from '../layout/theme/utils/colors';
import { COLLAPSE_BAR_SPACE, HEADER_GAP, HEADER_HEIGHT, MOBILECOLLAPSE_BAR_SPACE } from './Header.styles';
import { DRAWER_WIDTH, MOBILE_DRAWER_WIDTH } from './Navigation.styles';

export default makeStyles((theme: NextTheme) => createStyles({
  root: ({ isDashboard, isOpened }: {isDashboard: boolean, isOpened: boolean}) => ({
    position: isDashboard ? 'absolute' : 'fixed',
    top: isDashboard ? HEADER_GAP : HEADER_HEIGHT,
    right: 0,
    bottom: 0,
    left: isOpened ? DRAWER_WIDTH : COLLAPSE_BAR_SPACE,
    backgroundColor: Colors.alabaster,
  }),
  [theme.media.mobile]: {
    mobileLayout: {
      left: ({ isOpened }) => isOpened ? MOBILE_DRAWER_WIDTH : MOBILECOLLAPSE_BAR_SPACE,
      marginLeft: 5,
    },
  },
}));
