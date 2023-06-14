import { makeStyles } from '@material-ui/core';
import { grayDotStyles } from '../../dashboard.new/line.items/common/styles';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) => ({
  ...grayDotStyles(theme, {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  }),
  dueDate: {
    textAlign: 'left',
    color: Colors.error,
    fontSize: 14,
    paddingBottom: theme.spacing(0.5),
  },
  black: {
    color: Colors.black,
  },
}));
