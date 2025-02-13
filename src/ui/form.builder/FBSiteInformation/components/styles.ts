import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  sideAddress: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  radioContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(0.75),
  },
  expand: {
    fontSize: 18,
    marginRight: theme.spacing(2),
    color: Colors.textBlack,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
}));
