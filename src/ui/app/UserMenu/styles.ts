import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) => ({
  menu: {
    background: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(0.75),
    marginBottom: theme.spacing(0.75),
    '&:hover': {
      background: Colors.strokeDimmed,
    },
  },
  listItemIcon: {
    minWidth: 31,
  },
  text: {
    fontSize: 14,
    fontWeight: 400,
    color: Colors.textBlack,
  },
  icon: {
    height: 16,
    width: 16,
  },
  devider: {
    marginTop: theme.spacing(0.75),
    marginBottom: theme.spacing(0.75),
  },
}));
