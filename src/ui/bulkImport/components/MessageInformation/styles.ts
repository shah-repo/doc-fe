import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  messageContainer: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 5,
    padding: theme.spacing(0.875, 0.625),
    margin: `${theme.spacing(0)} auto ${theme.spacing(2.875)}px auto`,
    width: 'fit-content',
    minHeight: 20,
  },
  messageContainerError: {
    backgroundColor: Colors.errorLight,
  },
  messageContainerSuccess: {
    backgroundColor: Colors.successLight,
  },
  messageIconError: {
    color: Colors.error,
    width: 18,
    height: 18,
    marginRight: theme.spacing(1.25),
  },
  messageIcon: {
    color: Colors.statusReleased,
    width: 18,
    height: 18,
    marginRight: theme.spacing(1.25),
  },
  message: {
    fontSize: 14,
    fontWeight: 400,
  },
  viewErrors: {
    fontSize: 13,
    fontWeight: 700,
    marginLeft: theme.spacing(1.25),
    textDecoration: 'underline',
  },
}));
