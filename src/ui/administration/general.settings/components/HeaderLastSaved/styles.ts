import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    lineHeight: 1.25,
    color: Colors.textBlack,
  },
  icon: {
    marginRight: theme.spacing(1),
    color: Colors.primaryLight,
  },
}));
