import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  container: {
    textAlign: 'center',
    paddingBottom: 45,
    paddingTop: 45,
  },
  title: {
    fontSize: 21,
    fontWeight: 600,
    color: Colors.textBlack,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 400,
    color: Colors.textBlack,
  },
}));
