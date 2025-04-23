import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export const styles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  expand: {
    fontSize: 18,
    marginRight: theme.spacing(2),
    color: Colors.textBlack,
  },
  headerCheckbox: {
    marginLeft: theme.spacing(1),
  },
  revsTableDateTimeLabel: {
    fontSize: 12,
    padding: theme.spacing(0, 1),
  },
  checkboxRowContent: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxRowContentDone: {
    color: Colors.success,
  },
  checkboxRowContentFailed: {
    color: Colors.error,
  },
  checkboxRowContentInProgress: {
    color: Colors.warning,
  },
}));
