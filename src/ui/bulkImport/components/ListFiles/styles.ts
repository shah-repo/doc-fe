import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  listContainer: {
    paddingTop: theme.spacing(2.5),
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryHighlight,
    marginBottom: theme.spacing(1.25),
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: `${theme.spacing(2.5)}px`,
    '& .MuiListItemText-primary': {
      fontWeight: 700,
    },
  },
  fileIcon: {
    marginRight: theme.spacing(2),
  },
  removeIcon: {
    color: Colors.remove,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
