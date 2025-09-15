import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../../../layout/theme-next';

export default makeStyles((theme) => ({
  option: {
    fontSize: 14,
    overflowWrap: 'anywhere',
  },
  expired: {
    color: Colors.errorHighlight,
  },
  lotContainer: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  icon: {
    fontSize: 16,
    cursor: 'pointer',
  },
}));
