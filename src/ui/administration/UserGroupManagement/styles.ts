import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';
import { NextTheme } from '../../layout/theme-next/provider';

export default makeStyles<NextTheme>(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    padding: theme.spacing(2, 3.75, 0),
    backgroundColor: Colors.white,
    borderBottom: `1px solid ${Colors.tableStroke}`,
  },
  content: {
    flexGrow: 1,
    margin: theme.spacing(-6.5, 0, 0),
  },
}));
