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
    fontSize: 16,
    color: Colors.textBlack,
  },
  expandAll: {
    cursor: 'pointer',
    marginRight: theme.spacing(2.5),
  },
  container: {
    display: 'flex',
    gap: '35px',
  },
  popper: {
    zIndex: 1500,
    '&[x-out-of-boundaries]': {
      visibility: 'hidden',
      pointerEvents: 'none',
    },
  },
}));
