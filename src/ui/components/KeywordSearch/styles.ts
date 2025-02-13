import { makeStyles } from '@material-ui/core';
import { NextTheme } from '../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) => ({
  divider: {
    height: 30,
    marginRight: theme.spacing(1.5),
  },
  clear: {
    padding: 0,
    cursor: 'pointer',
  },
  confirm: {
    cursor: 'pointer',
  },
}));
