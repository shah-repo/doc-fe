import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  grid: {
    borderCollapse: 'collapse',

    '& .k-grid-content': {
      '& tr': {
        '& td': {
          padding: theme.spacing(0.25, 1.5),
          height: 42,
        },
      },
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
  inputRoot: {
    margin: theme.spacing(0, -1.375),
    width: `calc(100% + ${theme.spacing(2.75)}px)`,
  },
  inputText: {
    padding: theme.spacing(1.25),
  },
}));
