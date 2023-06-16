import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

const ROW_HEIGHT = 42;

export default makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  grid: {
    '& .k-grid-container': {
      minHeight: ROW_HEIGHT * 2,
    },
    '& .k-column-title': {
      fontSize: 12,
      textTransform: 'uppercase',
    },
    '& td': {
      height: ROW_HEIGHT,
      padding: `${theme.spacing(0.5, 1.5)} !important`,
    },
  },
  gridWithButton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: 'none',
  },
  actionsCell: {
    width: 0,
    overflow: 'visible !important',
    position: 'sticky',
    right: 0,
    padding: '0 !important',
    boxShadow: 'none !important',
    clipPath: 'none !important',
    borderLeft: `1px solid ${Colors.primaryLight} !important`,
  },
  updatingRow: {
    position: 'relative',
    zIndex: 3,
    outline: `1px solid ${Colors.primaryLight}`,
    outlineOffset: -1,
  },
}));
