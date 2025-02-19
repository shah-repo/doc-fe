import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.75, 0.75),
    margin: theme.spacing(0, -0.75),
  },
  inputRoot: {
    margin: theme.spacing(0, -1.125),
    width: `calc(100% + ${theme.spacing(2.25)}px)`,
  },
  '@keyframes newRowAnimation': {
    '0%': {
      backgroundColor: Colors.primaryHighlight,
    },
    '50%': {
      backgroundColor: Colors.primaryHighlight,
    },
    '100%': {
      backgroundColor: Colors.white,
    },
  },
  newRow: {
    '& td': {
      animation: `$newRowAnimation 5s ${theme.transitions.easing.easeIn}`,
    },
  },
}));
