import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../layout/theme/utils/colors';
import { HEADER_GAP, HEADER_HEIGHT } from './Header.styles';
import { DRAWER_WIDTH } from './Navigation.styles';

export default makeStyles(() => createStyles({
  root: (isDashboard: boolean) => ({
    position: isDashboard ? 'absolute' : 'fixed',
    top: isDashboard ? HEADER_GAP : HEADER_HEIGHT,
    right: 0,
    bottom: 0,
    left: DRAWER_WIDTH,
    backgroundColor: Colors.alabaster,
  }),
}));
