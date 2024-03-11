import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    width: 520,
  },
  contentWrapper: {
    width: '100%',
    paddingTop: theme.spacing(0.75),
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(3),
    whiteSpace: 'pre-line',
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
  },
  iconWrapper: {
    fontSize: 26,
    marginRight: theme.spacing(2),
  },
  icon: {
    color: Colors.error,
  },
}));
