import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export default makeStyles(theme => ({
  listContainer: {
    paddingTop: 20,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.sky_blue,
    marginBottom: 10,
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    '& .MuiListItemText-primary': {
      fontWeight: 700,
    },
  },
  fileIcon: {
    marginRight: theme.spacing(2),
  },
  removeIcon: {
    color: Colors.opal_red,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
