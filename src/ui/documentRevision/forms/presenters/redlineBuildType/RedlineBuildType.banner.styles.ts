import { makeStyles } from '@material-ui/core';
import { NextTheme } from '../../../../layout/theme-next/provider';
import Colors from '../../../../layout/theme/utils/colors';

export default makeStyles<NextTheme>(theme => ({
  root: {
    backgroundColor: Colors.latest_red_varient,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightBold,
    padding: theme.spacing(1),
    margin: theme.spacing(0, 1.25, 1.25),
    borderRadius: theme.shape.borderRadius,
    position: 'sticky',
    top: 0,
    zIndex: 5,
  },
}));
