import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

const ROW_HEIGHT = 40;

export default makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0),
  },
  grid: {
    '& .k-column-title': {
      fontSize: 12,
      textTransform: 'uppercase',
      whiteSpace: 'normal',
    },
    '& td': {
      height: ROW_HEIGHT,
      boxSizing: 'border-box',
      '& a': {
        color: Colors.textBlack,
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  },
  gridWithButton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: 'none',
    '& .k-grid-container': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  updatingRow: {
    position: 'relative',
    outline: `1px solid ${Colors.primaryLight}`,
    outlineOffset: -1,
    '& td': {
      whiteSpace: 'normal !important' as 'normal',
    },
  },
  actionsCell: {
    width: 0,
    overflow: 'visible !important',
    position: 'sticky',
    borderLeft: `1px solid ${Colors.primaryLight} !important`,
    right: 0,
    padding: '0 !important',
  },
  addButton: {
    float: 'right',
  },
  popperHolder: {
    height: '100%',
  },
  tooltipContent: {
    maxWidth: 425,
    maxHeight: 200,
    overflow: 'auto',
    whiteSpace: 'pre-line',
    paddingRight: theme.spacing(0.5),
    marginRight: theme.spacing(-0.5),
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
    right: 0,
    top: 18,
  },
  deleteIcon: {
    color: Colors.error,
  },
}));
