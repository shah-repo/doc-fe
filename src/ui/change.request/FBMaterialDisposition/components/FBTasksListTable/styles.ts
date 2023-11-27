import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles((theme) => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  rootTasksList: {
    '& .k-grid-container tbody td': {
      height: 52,
      padding: theme.spacing(1, 1.75),
      verticalAlign: 'middle !important',
    },
    '& .k-grid-header thead th': {
      textTransform: 'uppercase',
      color: Colors.textBlack,
    },

  },
  addButton: {
    float: 'right',
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

    '& > div': {
      borderLeft: `1px solid ${Colors.primaryLight} !important`,
    },
  },
}));
