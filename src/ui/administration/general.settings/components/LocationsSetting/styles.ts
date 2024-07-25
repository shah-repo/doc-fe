import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  grid: {
    marginTop: theme.spacing(2),
    borderCollapse: 'collapse',
    width: '100%',
    '& thead': {
      display: 'table-header-group',
    },
    '& tbody': {
      display: 'table-row-group',
    },
    '& .k-grid-content': {
      overflowY: 'auto',
      // maxHeight: '500px',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    '& .k-grid-header': {
      position: 'sticky',
      top: '27px',
    },
    '& .k-column-title': {
      fontSize: 12,
      textTransform: 'uppercase',
    },
    '& td': {
      height: 42,
      padding: `${theme.spacing(0.5, 1.5)} !important`,
    },
  },

  gridWithButton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: 'none',

    '& .k-grid-content, & .k-grid-container': {
      overflow: 'visible',
      overflowX: 'visible',
      overflowY: 'visible',
    },
  },
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
