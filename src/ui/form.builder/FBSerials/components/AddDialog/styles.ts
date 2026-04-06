import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  helper: {
    flexShrink: 0,
    margin: theme.spacing(0.75, 0),
  },
  helperText: {
    color: Colors.textDisabled,
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'end',
    gap: theme.spacing(0.5, 0.5),
  },
  autocompleteField: {
    paddingRight: theme.spacing(0.75),
  },
  autocompleteInput: {
    minWidth: '4ch',
  },
  autocompleteInputWithHelp: {
    flexGrow: 0,
    paddingLeft: theme.spacing(1.25),
  },
}));
