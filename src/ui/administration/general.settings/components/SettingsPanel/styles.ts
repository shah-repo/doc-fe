import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    margin: theme.spacing(0, 0, 3.75),
    border: `1px solid ${Colors.stroke}`,
    borderRadius: theme.spacing(0.5),
    boxShadow: 'none',

    '&.Mui-expanded': {
      margin: theme.spacing(0, 0, 3.75),
    },
    '&::before': {
      display: 'none',
    },
  },
  summary: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: theme.spacing(2, 1.5),
    borderRadius: theme.spacing(0.75),
    background: Colors.white,
    border: `1px solid ${Colors.white}`,
    position: 'sticky',
    top: 0,
    zIndex: 2,

    '&.Mui-expanded': {
      minHeight: 0,
      color: Colors.primary,
    },
  },
  stickySummary: {
    '&.Mui-expanded': {
      borderTop: `1px solid ${Colors.stroke}`,
      borderBottom: `1px solid ${Colors.stroke}`,
      borderRadius: 0,
    },
  },
  icon: {
    marginRight: theme.spacing(1),

    '&.Mui-expanded': {
      color: Colors.primary,
      transform: 'rotate(90deg)',
    },
  },
  iconButton: {
    width: 24,
    minHeight: 24,
    height: 24,
  },
  content: {
    margin: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    '&.Mui-expanded': {
      margin: 0,
    },
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
  },
  info: {
    fontWeight: 400,
    fontSize: 12,
    color: Colors.textGray,
  },
  details: {
    display: 'block',
    padding: theme.spacing(0, 2, 2, 6.25),
  },
  detailsWithStickyTitle: {
    '& .k-grid-header': {
      position: 'sticky',
      top: 64,
      zIndex: 1,
      borderRadius: 0,
    },
  },
  settingOutOfSync: {
    justifyContent: 'normal',
  },
  outOfSyncBox: {
    cursor: 'default',
  },
  outOfSyncIcon: {
    marginLeft: theme.spacing(2),
    color: Colors.error,
    width: 20,
    height: 20,
  },
}));
