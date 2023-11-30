import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  cellStyle: {
    textAlign: 'center',
    color: props => props.isActive ? Colors.textBlack : Colors.textDisabled,
  },
  deleteButton: {
    color: Colors.error,
  },
}));
