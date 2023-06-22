import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

const ROW_HEIGHT = 40;

export default makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  grid: {
    '& .k-column-title': {
      fontSize: 12,
      textTransform: 'uppercase',
    },
    '& td': {
      height: ROW_HEIGHT,
      boxSizing: 'border-box',
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

    '& td': {
      verticalAlign: 'top !important',
      whiteSpace: 'normal !important' as 'normal',
    },
  },
  actionsCell: {
    overflow: 'visible !important',
    position: 'sticky',
    right: 0,
    width: '0 !important',
    padding: '0 !important',
    verticalAlign: 'bottom !important',
    borderLeft: `1px solid ${Colors.primaryLight} !important`,
  },
}));
