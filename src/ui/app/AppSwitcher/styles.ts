import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles(theme => ({
  container: {
    display: 'flex',

    [theme.breakpoints.down('sm')]: {
      cursor: 'pointer',
    },
  },
  logo: {
    height: 30,
    marginRight: theme.spacing(2.25),

    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(0.75),
    },
  },
  toggler: {
    height: 30,
    margin: theme.spacing(0, 1.25),

    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  link: {
    textDecoration: 'none !important',

    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  options: {
    opacity: 0.5,
    cursor: 'pointer',
    borderRadius: theme.shape.borderRadius,

    '&:hover': {
      opacity: 1,
      backgroundColor: Colors.primaryDark,
    },
  },
  optionItemText: {
    padding: theme.spacing(0.625),
    fontWeight: 600,
    fontSize: 15,
    color: Colors.white,
  },
  menu: {
    margin: theme.spacing(3, 0, 0),
    minWidth: 150,
  },
  menuIcon: {
    color: Colors.white,
    marginLeft: theme.spacing(0.25),

    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuTitle: {
    fontSize: 11,
    color: Colors.textDisabled,
    padding: theme.spacing(1, 1.5, 0.75),
    lineHeight: 1,
  },
  menuLink: {
    padding: theme.spacing(1.5, 1.5),
    color: Colors.textBlack,
    fontWeight: 600,
    lineHeight: 1,
    minHeight: 0,
  },
}));
