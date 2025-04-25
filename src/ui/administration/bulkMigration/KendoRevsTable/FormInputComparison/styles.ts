import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

const ROW_HEIGHT = 40;
export default makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  detailsGrid: {
    '& .k-column-title': {
      fontSize: 12,
    },
    '& .k-grid-toolbar, thead tr': {
      backgroundColor: Colors.tableDetailRow,
      '&:hover': {
        backgroundColor: Colors.tableDetailRow,
      },
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
  marginTop: {
    marginTop: theme.spacing(3),
  },
}));
