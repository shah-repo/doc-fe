import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

const messageContainerBase = theme => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 5,
  padding: theme.spacing(0.875, 0.625),
  margin: `${theme.spacing(0)} auto ${theme.spacing(2.875)}px auto`,
  width: 'fit-content',
});

export default makeStyles(theme => ({
  messageContainer: {
    ...messageContainerBase(theme),
    backgroundColor: Colors.successLight,
  },
  messageContainerError: {
    ...messageContainerBase(theme),
    backgroundColor: Colors.errorLight,
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
