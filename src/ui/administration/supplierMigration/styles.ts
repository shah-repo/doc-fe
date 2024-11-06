import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';
import { NextTheme } from '../../layout/theme-next/provider';

export default makeStyles<NextTheme>(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gridGap: theme.spacing(2.5, 3),
    padding: theme.spacing(3, 3, 0),
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'items-center',
    gridGap: theme.spacing(2.5, 3),
  },
  flexBoxColumn: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: theme.spacing(2.5, 3),
  },
  header: {
    borderBottom: `1px solid ${Colors.stroke}`,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing(2.5),
  },
  title: {
    fontSize: 21,
    marginBottom: theme.spacing(0.5),
    color: Colors.textBlack,
  },
  subtitle: {
    color: Colors.textGray,
  },
  smallText: {
    fontSize: 12,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    whiteSpace: 'nowrap',
    flexWrap: 'wrap',
    gap: theme.spacing(1, 1.25),
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5, 1.25),
  },
  dateTimeLabel: {
    fontSize: 12,
    position: 'relative',
    top: -4,
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  list: {
    padding: 0,
  },
  listItem: {
    borderRadius: 4,
    padding: theme.spacing(1, 1.25),
    marginBottom: theme.spacing(0.5),
    color: Colors.textGray,
    fontSize: 12,
    minHeight: 0,

    '&.Mui-selected': {
      backgroundColor: Colors.primaryBg,
      color: Colors.primaryDark,
      fontWeight: 600,

      '&:hover': {
        backgroundColor: Colors.primaryBg,
      },
    },
    '&:hover': {
      backgroundColor: Colors.primaryBg,
    },
  },
  panels: {
    paddingBottom: theme.spacing(3),
  },
  formSchemaPanel: {
    maxHeight: '70vh',
    overflow: 'hidden',
    overflowY: 'auto',

    '& p': {
      wordBreak: 'break-all',
      wordWrap: 'break-word',
      paddingBottom: theme.spacing(0.5),
      borderBottom: `1px solid ${Colors.stroke}`,
    },
  },
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
}));
