import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  container: {
    textAlign: 'center',
    paddingBottom: theme.spacing(5.625),
    paddingTop: theme.spacing(5.625),
  },
  title: {
    fontSize: 21,
    fontWeight: 600,
    color: Colors.textBlack,
    marginBottom: theme.spacing(0.625),
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 400,
    color: Colors.textBlack,
  },
}));
