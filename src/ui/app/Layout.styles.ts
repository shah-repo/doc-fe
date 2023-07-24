import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../layout/theme/utils/colors';
import { COLLAPSE_BAR_SPACE, HEADER_GAP, HEADER_HEIGHT } from './Header.styles';
import { DRAWER_WIDTH } from './Navigation.styles';

export default makeStyles(() => createStyles({
  root: (props: {isDashboard: boolean, open: boolean}) => ({
    position: props.isDashboard ? 'absolute' : 'fixed',
    top: props.isDashboard ? HEADER_GAP : HEADER_HEIGHT,
    right: 0,
    bottom: 0,
    left: props.open ? DRAWER_WIDTH : COLLAPSE_BAR_SPACE,
    backgroundColor: Colors.alabaster,
  }),
}));
