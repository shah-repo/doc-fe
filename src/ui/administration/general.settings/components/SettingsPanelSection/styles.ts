import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    fontSize: 16,
    marginBottom: theme.spacing(2.5),
    paddingBottom: theme.spacing(1),
    borderBottom: `1px solid ${Colors.stroke}`,
  },
}));
