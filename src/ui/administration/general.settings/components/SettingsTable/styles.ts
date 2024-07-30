import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  grid: {
    borderCollapse: 'collapse',

    '& .k-grid-header': {
      position: 'sticky',
      top: 64,
      zIndex: 1,
    },
  },
  gridWithButton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: 'none',
  },
  updatingRow: {
    position: 'relative',
    zIndex: 3,
    outline: `1px solid ${Colors.primaryLight}`,
    outlineOffset: -1,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(0, -1.5),
  },
  actionsEdit: {
    gap: theme.spacing(0, 0.25),
  },
}));
