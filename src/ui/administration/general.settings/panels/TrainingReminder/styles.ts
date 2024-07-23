import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  gridContainer: {
    marginTop: theme.spacing(1),
    justifyContent: 'space-between',
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  textArea: {
    width: '80px',
    height: '35px',
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
