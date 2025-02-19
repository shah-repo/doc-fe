import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  container: {
    flex: 1,
    borderRadius: 4,
    padding: theme.spacing(2.5),
    paddingLeft: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: theme.spacing(2.75),
    alignSelf: 'center',
  },
  filtersContainer: {
    marginLeft: 'auto',
  },
  titleContainer: {
    display: 'flex',
  },
  filterByText: {
    fontSize: 12,
    fontWeight: 600,
    minWidth: 50,
    alignSelf: 'center',
  },
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusActions: {
    display: 'flex',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: theme.spacing(1),
  },
  select: {
    width: 150,
    height: 36,
    color: Colors.textDisabled,
  },
  selectInput: {
    fontSize: 12,
  },
  form: {
    display: 'flex',
    gap: theme.spacing(1.25, 1.25),
    height: 36,
    marginBottom: theme.spacing(1.875),
  },
}));
