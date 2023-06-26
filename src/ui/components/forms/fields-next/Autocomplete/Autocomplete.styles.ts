import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles((theme) => ({
  inputRoot: {
    padding: theme.spacing(0, 4.5, 0, 0.75),
  },
  root: {
    ...theme.overrides?.MuiInputBase?.input,
    height: 'auto',
    padding: 0,
  },
  focused: {
    ...theme.overrides?.MuiInputBase?.input?.['&:focus'],

    '&:hover': {
      background: Colors.white,
    },
  },
  input: {
    border: 'none',
    background: 'none',
    '&:hover': {
      background: 'none',
    },
    '&:focus': {
      background: 'none',
    },
    '&:focus:hover': {
      background: 'none',
    },
    '&:first-child': {
      paddingLeft: theme.spacing(1.25),
    },
  },
  sizeSmall: {
    padding: theme.spacing(0, 4, 0, 0.25),
  },
  withClearIcon: {
    padding: theme.spacing(0, 7, 0, 0.75),
  },
  smallWithClearIcon: {
    padding: theme.spacing(0, 6.5, 0, 0.25),
  },
  popupIndicator: {
    fontSize: 14,
    color: Colors.textGray,
    padding: theme.spacing(0.5),
    margin: 0,
    height: 28,

    '&:hover': {
      color: Colors.textBlack,
    },
  },
  clearIndicator: {
    margin: 0,
    '&:hover': {
      color: Colors.textBlack,
    },
  },
  endAdornment: {
    display: 'flex',
    right: theme.spacing(1),
    gap: theme.spacing(1),
  },
  paper: {
    ...theme.overrides?.MuiMenu?.paper,
    boxShadow: theme.shadows[2],
  },
  listbox: {
    padding: 0,
  },
  option: {
    ...theme.overrides?.MuiMenuItem?.root,
  },
  optionSmall: {
    ...theme.overrides?.MuiMenuItem?.dense,
    ...theme.overrides?.MuiMenuItem?.gutters,
  },
  tag: {
    margin: theme.spacing(0.75, 0.75, 0.75, 0),
    minWidth: 48,
  },
  tagSizeSmall: {
    margin: theme.spacing(0.25, 0.25, 0.25, 0),
    height: 24,
  },
  disabled: {
    color: Colors.textGray,
  },
}));
