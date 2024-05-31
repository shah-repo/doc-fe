import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  container: {},
  buttonsContainer: {
    display: 'grid',
    marginTop: 20,
  },
  buttonsContainerMultiBtn: {
    display: 'flex',
    marginTop: 20,
  },
  buttonsNext: {
    justifySelf: 'right',
    minWidth: 140,
    fontWeight: 700,
  },
  buttonsBack: {
    justifySelf: 'right',
    minWidth: 140,
    fontWeight: 700,
    marginLeft: 'auto',
    marginRight: 20,
  },
  helpContainer: {
    display: 'flex',
    fontSize: 12,
    fontWeight: 400,
    color: Colors.primary,
    gap: '10px',
  },
  containerHelp: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageQuestionIcon: {
    color: Colors.primary,
    width: 19,
    height: 15,
  },
}));
