import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles((theme) => ({
  fileName: {
    cursor: 'pointer',
    color: Colors.primary,
  },
  redLineIcon: {
    color: Colors.error,
    marginRight: theme.spacing(1),
    height: 16,
  },
  primaryIcon: {
    color: Colors.primary,
    marginRight: theme.spacing(1),
    height: 16,
  },
  fileNameContainer: {
    display: 'flex',
  },
  icon: {
    color: Colors.lightGray2,
  },
  iconButton: {
    marginLeft: theme.spacing(1),
    cursor: 'pointer',
    backgroundColor: Colors.hover,
    borderRadius: theme.spacing(0.2),
  },
  columnMenuItem: {
    margin: 0,
    padding: 0,
    width: 250,
  },
  menuIcons: {
    marginRight: theme.spacing(2),
    height: 16,
    width: 16,
  },
  menuDeleteIcon: {
    color: Colors.error,
  },
}));
