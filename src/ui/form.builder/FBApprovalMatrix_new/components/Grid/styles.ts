import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles((theme) => ({
  updating: {
    position: 'relative',
    zIndex: 3,
    '& td:first-child': {
      borderLeft: `1px solid ${Colors.primaryLight} !important`,
      paddingLeft: '19px !important',
    },
    '& td': {
      borderTop: `1px solid ${Colors.primaryLight} !important`,
      borderBottom: `1px solid ${Colors.primaryLight} !important`,
      paddingTop: '19px !important',
    },
  },
  inactive: {
    '&:not(:hover) td': {
      color: `${Colors.textDisabled} !important`,
      backgroundColor: `${Colors.gray} !important`,
    },
  },
  save: {
    position: 'relative',
  },
  discard: {
    position: 'relative',
  },
  grid: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: 'none',
    '& .k-grid-container': {
      maxHeight: 300,
    },
    '& th': {
      border: 'none',
    },
    '& .k-column-title': {
      fontSize: 12,
      textTransform: 'uppercase',
    },
    '& .k-master-row': {
      '& td': {
        padding: 20,
      },
    },
    '& .k-filtercell': {
      '& .k-dropdown-wrap, & input': {
        border: 'none',
      },
    },
    '& .k-checkbox': {
      borderWidth: 1,
    },
  },
  buttonAdd: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  actionsTd: {
    width: 0,
    overflow: 'visible !important',
    position: 'sticky',
    right: 0,
    padding: '0 !important',
  },
  actions: {
    width: 60,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.primaryLight,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    position: 'absolute',
    zIndex: 3,
    right: 0,
    top: '100%',
  },
  actionButton: {
    minWidth: 25,
    minHeight: 25,
    backgroundColor: Colors.white,
    borderRadius: 6,
    padding: theme.spacing(0.6),
    border: 'none !important',
  },
  iconButton: {
    fontSize: 16,
    color: Colors.textGray,
    '&:hover': {
      color: Colors.primary,
    },
  },
  // @todo: make via borderRight.
  line: {
    width: 1,
    backgroundColor: Colors.primaryLight,
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 3,
  },
}));
