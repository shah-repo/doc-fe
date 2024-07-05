import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../../../layout/theme-next';

export default makeStyles((theme) => ({
  rootMDTable: {
    '& .k-grid-container tbody td': {
      height: 42,
      padding: theme.spacing(0, 1.75),
      verticalAlign: 'middle !important',
    },
    '& .k-grid-container tbody td:first-child': {
      paddingLeft: theme.spacing(2.5),
    },
    '& .k-grid-header thead th:first-child': {
      paddingLeft: theme.spacing(2.5),
    },
    '& .k-grouping-header': {
      display: 'none',
    },
    '& .k-grid-header thead th': {
      textTransform: 'uppercase',
      color: Colors.textBlack,
    },
    '& .k-grid-content tr:hover td': {
      backgroundColor: Colors.white,
    },
    '& td.k-state-selected': {
      backgroundColor: Colors.white,
    },
  },
  toggleExpandCollapse: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 400,
    cursor: 'pointer',
    height: 24,
  },
  disabled: {
    pointerEvents: 'none',
  },
  toolbarContainer: {
    height: 44,
    paddingBottom: theme.spacing(1.25),
    paddingRight: theme.spacing(1.25),
  },
  icon: {
    color: Colors.textBlack,
    paddingRight: theme.spacing(1.25),
    width: 14,
    height: 14,
    cursor: 'pointer',
  },
  refreshContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  refreshText: {
    color: Colors.textBlack,
    marginRight: theme.spacing(2.5),
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
}));
