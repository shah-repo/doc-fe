import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';
import { NextTheme } from '../../../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) => ({
  container: {
    padding: theme.spacing(0.2, 0.5, 0.1),
    background: `linear-gradient(270deg, ${Colors.primaryLight} 0%, ${Colors.secondary} 127.78%)`,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    color: Colors.white,
  },
}));
