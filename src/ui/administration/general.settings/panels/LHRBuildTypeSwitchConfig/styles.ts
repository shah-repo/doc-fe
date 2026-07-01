import { makeStyles, createStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export const useStyles = makeStyles((theme) =>
  createStyles({
    supplierGrid: {
    '& .k-grid-header': {
      position: 'sticky',
      top: 0,
      zIndex: 3,
    },
    '& .k-grid-header-locked': {
      position: 'sticky',
      top: 0,
      zIndex: 4,
    },
    '& .k-grid-header-wrap': {
      overflow: 'hidden',
    },
    '& .k-header': {
      whiteSpace: 'normal',
      lineHeight: 1.2,
    },
  },
  header: {
    whiteSpace: 'normal',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '1.2',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.75, 0.75),
    margin: theme.spacing(0, -0.75),
  },
  inputRoot: {
    margin: theme.spacing(0, -1.125),
    width: `calc(100% + ${theme.spacing(2.25)}px)`,
  },
  '@keyframes newRowAnimation': {
    '0%': {
      backgroundColor: Colors.primaryHighlight,
    },
    '50%': {
      backgroundColor: Colors.primaryHighlight,
    },
    '100%': {
      backgroundColor: Colors.white,
    },
  },
  newRow: {
    '& td': {
      animation: `$newRowAnimation 5s ${theme.transitions.easing.easeIn}`,
    },
  },
  subTitle: {
    marginBottom: theme.spacing(2),
  },
  }),
);
