import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  container: {
    display: 'flex',
    marginTop: theme.spacing(2.5),
    width: '100%',
  },
  buttonsContainer: {
    display: 'grid',
    marginLeft: 'auto',
  },
  buttonsContainerMultiBtn: {
    display: 'flex',
    marginLeft: 'auto',
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
    marginRight: theme.spacing(2.5),
  },
  buttonsCancel: {
    justifySelf: 'left',
    minWidth: 140,
    fontWeight: 700,
  },
  helpContainer: {
    display: 'flex',
    fontSize: 12,
    fontWeight: 400,
    color: Colors.primary,
    gap: theme.spacing(1.25, 1.25),
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
