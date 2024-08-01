import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  grid: {
    borderCollapse: 'collapse',

    '& .k-grid-content': {
      '& tr': {
        height: 38,

        '& td': {
          padding: theme.spacing(0.5, 1.5),

          '& .Mui-error': {
            marginTop: theme.spacing(0.25),
          },
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

    '& td': {
      verticalAlign: 'top !important',
      whiteSpace: 'normal !important' as 'normal',
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(0, -1.5),
  },
  actionsEdit: {
    gap: theme.spacing(0, 1.12),
    margin: theme.spacing(0.5, 0, 0),
  },
  activeCheckbox: {
    margin: theme.spacing(0.75, 0, 0),
  },
  inputRoot: {
    margin: theme.spacing(0, -1.125),
    width: `calc(100% + ${theme.spacing(2.25)}px)`,
  },
}));
