import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../../../layout/theme-next';

export default makeStyles((theme) => ({
  deleteButton: {
    color: Colors.error,
  },
  editButtons: {
    width: 20,
    height: 20,
  },
  container: {
    width: '95%',
  },
  editContainer: {
    width: '100%',
  },
  buttons: {
    marginRight: theme.spacing(1.2),
  },
  toggleExpandCollapse: {
    paddingRight: theme.spacing(1.2),
    cursor: 'pointer',
  },
}));
