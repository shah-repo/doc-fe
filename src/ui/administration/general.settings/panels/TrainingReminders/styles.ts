import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  gridContainer: {
    margin: theme.spacing(3, 0, 2),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center',

    '& > div': {
      marginBottom: 0,
    },
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
