import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';
import { NextTheme } from '../../layout/theme-next/provider';

export default makeStyles<NextTheme>(theme => createStyles({
  root: {
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    padding: theme.spacing(0, 4),
  },
  header: {
    padding: theme.spacing(8, 0, 2.5),

    [theme.media.mobile]: {
      padding: theme.spacing(2.5, 0),
    },
  },
  logo: {
    display: 'block',
    margin: '0 auto',
    transform: 'translate(-20%, 0)',
  },
  formTitle: {
    textAlign: 'center',
    margin: theme.spacing(2.5, 0, 6.25),
  },
  title: {
    fontWeight: 'bold',
    color: Colors.textBlack,
    fontSize: 31,
    margin: 0,
    padding: 0,
  },
  subtitle: {
    color: Colors.textGray,
    fontSize: 12,
    marginTop: 4,
    padding: 0,
    fontWeight: 400,
  },
  form: {
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4.25, 3),
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
  },
  field: {
    fontSize: 16,
    padding: theme.spacing(2.25, 2),
  },
  helper: {
    position: 'absolute',
    top: '100%',
  },
  submit: {
    width: '100%',
    padding: theme.spacing(2.5),
    margin: theme.spacing(2, 0),
    fontSize: 14,
    fontWeight: 500,
  },
  actions: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    textDecoration: 'none',
    color: Colors.primary,
    fontSize: 16,
  },
}));
