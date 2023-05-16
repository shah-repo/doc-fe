import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 2, 0),
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: theme.palette.divider,
  },
  list: {
    margin: theme.spacing(1.5, -2, 1.5),
  },
  link: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));
