import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  gridContainer: {
    marginTop: theme.spacing(1),
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  textArea: {
    width: 80,
    height: 35,
    marginRight: theme.spacing(0.5),
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
  disabledGrid: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
}));
