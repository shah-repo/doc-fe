import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  container: {
    display: 'block',
    margin: '0 auto',
    maxWidth: 550,
  },
  title: {
    fontSize: 30,
    fontWeight: 600,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 400,
  },
  listContainer: {
    paddingTop: theme.spacing(2.5),
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryHighlight,
    marginBottom: theme.spacing(1.25),
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  fileIcon: {
    marginRight: theme.spacing(2),
    width: 42,
    height: 42,
    color: Colors.lightGray,
  },
  avatar: {
    marginRight: theme.spacing(2),
    width: 42,
    height: 42,
  },
  removeIcon: {
    color: Colors.remove,
  },
  select: {
    width: '100%',
  },
  formControl: {
    width: '100%',
  },
  selectLabel: {
    marginBottom: theme.spacing(2.5),
    fontSize: 14,
    fontWeight: 600,
  },
  noMarginBottom: {
    marginBottom: 0,
  },
  autocomplete: {
    '&.MuiAutocomplete-inputRoot': {
      height: 47,
    },
  },
  withdrawSubmission: {
    float: 'inline-end',
  },
}));
