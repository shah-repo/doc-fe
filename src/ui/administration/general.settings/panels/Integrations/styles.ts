import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  enabledIcon: {
    fontSize: 20,
    color: Colors.success,
    marginRight: theme.spacing(0.5),
    verticalAlign: 'middle',
  },
  enabledLabel: {
    marginRight: theme.spacing(1),
    verticalAlign: 'middle',
  },
}));
