import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../../../layout/theme-next';

export default makeStyles((theme) => ({
  deleteButton: {
    color: Colors.error,
  },
  toggleExpandCollapse: {
    paddingRight: theme.spacing(1.2),
    cursor: 'pointer',
  },
}));
