import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

const ROW_HEIGHT = 36;

export default makeStyles(theme => ({
  checkbox: {
    paddingLeft: `${theme.spacing(2)}px !important`,
  },
  headerCheckbox: {
    marginLeft: theme.spacing(1),
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 400,
    marginBottom: theme.spacing(0.5),
    gap: theme.spacing(1, 1),
  },
  selectionContainer: {
    display: 'flex',
    gap: theme.spacing(1, 1),
    alignItems: 'center',
    paddingRight: theme.spacing(2),
    marginRight: theme.spacing(1),
    borderRight: `1px solid ${Colors.stroke}`,
  },
  gridContainer: {
    height: '50vh',
    minHeight: 230,
    width: '100%',
    position: 'relative',
  },
  gridContainerEmpty: {
    height: 'auto',
    minHeight: 0,
  },
  grid: {
    '& .k-column-title': {
      fontSize: 12,
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
  selectedCount: {
    color: Colors.primary,
    fontWeight: 700,
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
  acceptIcon: {
    color: Colors.success,
  },
  rejectIcon: {
    color: Colors.error,
  },
  deleteIcon: {
    color: Colors.error,
  },
  icon: {
    fontSize: '12px !important',
  },
  statusOption: {
    display: 'flex',
    alignItems: 'center',
  },
  startAdornment: {
    marginLeft: theme.spacing(1.25),
  },
  dot: {
    backgroundColor: Colors.textGray,
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: theme.spacing(1),
    flexShrink: 0,
  },
  accepted: {
    backgroundColor: Colors.success,
  },
  rejected: {
    backgroundColor: Colors.error,
  },
}));
