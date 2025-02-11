import { makeStyles } from '@material-ui/core';

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
    marginRight: theme.spacing(1),
  },
}));
