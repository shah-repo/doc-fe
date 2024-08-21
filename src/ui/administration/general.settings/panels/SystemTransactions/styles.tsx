import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  inputRoot: {
    margin: theme.spacing(0, -1.125),
    width: `calc(100% + ${theme.spacing(2.25)}px)`,
  },
}));
