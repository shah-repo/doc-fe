import { makeStyles } from '@material-ui/core/styles';
import { omit } from 'lodash';
import { Colors } from '../../../../ui/layout/theme-next';

export default makeStyles((theme) => ({
  root: {
    width: 350,
  },
  focused: {
    width: '100%',
  },
  popper: {
    width: '100%',
  },
  paper: {
    ...omit(theme.overrides?.MuiMenu?.paper, 'boxShadow'),
    boxShadow: theme.shadows[2],
    marginTop: theme.spacing(-5),
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(1),
  },
  inputFocused: {
    border: 'none',
    background: 'none',
    zIndex: 1301,
  },
  groupLabel: {
    ...theme.typography.h6,
    padding: theme.spacing(1.25, 0),
    margin: theme.spacing(0, 2),
    borderTop: `1px solid ${Colors.stroke}`,
  },
  icon: {
    color: Colors.textBlack,
  },
  option: {
    minHeight: 30,
  },
}));
