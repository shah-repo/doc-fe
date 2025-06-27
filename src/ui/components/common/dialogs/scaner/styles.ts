import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    width: '60vw',
  },
  contentWrapper: {
    width: '100%',
    paddingTop: theme.spacing(0.75),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  key: {
    width: 200,
    fontSize: 14,
    color: Colors.textBlack,
  },
  value: {
    fontSize: 14,
    color: Colors.textGray,
  },
}));
