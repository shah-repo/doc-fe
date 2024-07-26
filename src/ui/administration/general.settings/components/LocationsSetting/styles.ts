import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  grid: {
    marginTop: theme.spacing(2),
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
  actionsCell: {
    width: 0,
    overflow: 'visible !important',
    position: 'sticky',
    right: 0,
    padding: '0 !important',
  },
  updatingRow: {
    position: 'relative',
    zIndex: 3,
    outline: `1px solid ${Colors.primaryLight}`,
    outlineOffset: -1,
  },
  paper: {
    pointerEvents: 'auto',
  },
  cellStyle: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(0.5, 0.5),
  },
}));
