import { makeStyles } from '@material-ui/core';

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
}));
