import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export default makeStyles(theme => ({
  container: {
    flex: 1,
    borderRadius: 4,
    padding: 20,
  },
  title: {
    fontFamily: 'Sora',
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 22,
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
  progressTitle: {
  },
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
  },
  errorButton: {
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
    color: Colors.lightest_grey2,
  },
  selectInput: {
    fontSize: 12,
  },
  form: {
    display: 'flex',
    gap: '10px',
    height: 36,
    marginBottom: 15,
  },
}));
