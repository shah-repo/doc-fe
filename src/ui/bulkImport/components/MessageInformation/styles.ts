import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

const messageContainerBase = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: 5,
  padding: '7px 5px',
  margin: '0 auto 23px auto',
  width: 'fit-content',
};

export default makeStyles(theme => ({
  messageContainer: {
    ...messageContainerBase,
    backgroundColor: '#B4FFEC',
  },
  messageContainerError: {
    ...messageContainerBase,
    backgroundColor: '#FFD9D1',
  },
  messageIconError: {
    color: Colors.latest_red_varient,
    width: 18,
    height: 18,
    marginRight: 10,
  },
  messageIcon: {
    color: Colors.latest_green_varient,
    width: 18,
    height: 18,
    marginRight: 10,
  },
  message: {
    fontSize: 14,
    fontWeight: 400,
  },
  viewErrors: {
    fontSize: 13,
    fontWeight: 700,
    marginLeft: 10,
    textDecoration: 'underline',
  },
}));
