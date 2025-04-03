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
    gap: theme.spacing(4.375),
  },
  popper: {
    zIndex: 1500,
    '&[x-out-of-boundaries]': {
      visibility: 'hidden',
      pointerEvents: 'none',
    },
  },
}));
