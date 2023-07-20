import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  input: {
    resize: 'none',
  },
  inputSmall: {
    padding: theme.spacing(0.5, 1),
  },
  withEndAdornment: {
    paddingRight: 0,
  },
  withStartAdornment: {
    paddingLeft: 0,
  },
}));
