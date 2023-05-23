import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) => ({
  grid: {
    '& .k-column-title': {
      fontSize: 12,
      textTransform: 'uppercase',
    },
    '& .k-filtercell': {
      '& .k-dropdown-wrap, & input': {
        border: 'none',
      },
    },
    '& .k-grid-header': {
      position: 'sticky',
      top: -28,
      zIndex: 4,
    },
    '& .k-grid-content, & .k-grid-container': {
      overflow: 'visible',
      overflowX: 'visible',
      overflowY: 'visible',
    },
    '& td': {
      height: 48,
      padding: `${theme.spacing(1, 1.5)} !important`,
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
  },
  updatingRow: {
    position: 'relative',
    zIndex: 3,
    outline: `1px solid ${Colors.primaryLight}`,
    outlineOffset: -1,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.75, 0.75),
  },
  actions: {
    gap: theme.spacing(1.25, 1.25),
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1.25),
    backgroundColor: Colors.primaryLight,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    position: 'absolute',
    zIndex: 3,
    right: 0,
    top: '100%',
  },
}));
