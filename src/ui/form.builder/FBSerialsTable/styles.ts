import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';
import { PAGE_SIZE, PANELS_HEIGHT, ROW_HEIGHT } from './const';

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
    maxHeight: `min(${PANELS_HEIGHT + ROW_HEIGHT * PAGE_SIZE}px, 50vh)`,
    minHeight: PANELS_HEIGHT + ROW_HEIGHT,
    width: '100%',
    position: 'relative',
  },
  gridContainerEmpty: {
    height: 'auto',
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
  disabledRow: {
    '& .k-checkbox': {
      pointerEvents: 'none',
      opacity: 0.5,
      cursor: 'not-allowed',
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

export const useTextCellStyles = makeStyles(theme => ({
  disabledValue: {
    color: Colors.textDisabled,
  },
  disabledIcon: {
    color: Colors.primaryLight,
    marginLeft: theme.spacing(0.5),
  },
}));

export const useNotesCellStyles = makeStyles(theme => ({
  displayValue: {
    width: '100%',
    minHeight: theme.spacing(3),
    cursor: 'text',
  },
  disabledDisplayValue: {
    color: Colors.textDisabled,
    cursor: 'default',
  },
  inputRoot: {
    width: '100%',
  },
}));

export const useStatusButtonStyles = makeStyles(theme => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    color: Colors.textBlack,
    borderColor: Colors.stroke,
    fontWeight: 400,
    fontSize: 12,
    padding: theme.spacing(0.5, 1, 0.5, 1.5),

    '&:hover': {
      borderColor: Colors.stroke,
    },
  },
  selected: {
    color: Colors.white,
  },
  rejected: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  accepted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  icon: {
    fontSize: '12px !important',
  },
}));
