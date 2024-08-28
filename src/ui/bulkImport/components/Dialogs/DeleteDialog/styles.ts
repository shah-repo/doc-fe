import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  exclamationIcon: {
    color: Colors.error,
    width: 22,
    height: 20.5,
    marginRight: theme.spacing(2.5),
  },
  buttonsContainer: {
    padding: theme.spacing(2.5),
    backgroundColor: Colors.gray,
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(5.5),
    paddingTop: theme.spacing(5),
  },
  bodyContainer: {
    paddingLeft: theme.spacing(10.25),
    paddingRight: theme.spacing(5),
    paddingTop: 0,
    '& p': {
      fontWeight: 400,
      fontSize: 14,
    },
    '& p:first-of-type': {
      marginTop: 0,
    },
  },
}));
