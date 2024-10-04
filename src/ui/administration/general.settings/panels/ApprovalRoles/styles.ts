import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  dialogTitle: {
    justifyContent: 'normal',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(4),
  },
  dialogContent: {
    marginLeft: theme.spacing(5),
    paddingTop: theme.spacing(1),
  },
  infoIcon: {
    width: 25,
    height: 25,
    color: Colors.primaryLight,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: theme.spacing(2),
  },
  bottomText: {
    marginTop: theme.spacing(2),
  },
}));
