import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';
import { MAX_PANEL_WIDTH } from '../../constants';

export default makeStyles(theme => ({
  root: {
    maxWidth: MAX_PANEL_WIDTH,
    marginBottom: theme.spacing(1),
    border: `1px solid ${Colors.stroke}`,
    borderRadius: theme.spacing(0.5),
    boxShadow: 'none',
  },
  summary: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: theme.spacing(2, 1.5),

    '&$expanded': {
      minHeight: 0,
      color: Colors.primary,
    },
  },
  icon: {
    marginRight: theme.spacing(1.25),

    '&$expanded': {
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

    '&$expanded': {
      margin: 0,
    },
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
  },
  details: {
    display: 'block',
    padding: theme.spacing(0, 2, 2, 6.25),
  },
}));
