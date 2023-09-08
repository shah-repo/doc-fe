import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../layout/theme-next';

const ROW_HEIGHT = 40;
export default makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  grid: {
    '& .k-column-title': {
      fontSize: 12,
    },
    '& td': {
      height: ROW_HEIGHT,
      boxSizing: 'border-box',

      '& a': {
        color: Colors.textBlack,

        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  },
}));
