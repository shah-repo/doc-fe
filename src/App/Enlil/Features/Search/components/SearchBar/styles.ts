import { makeStyles } from '@material-ui/core/styles';
import { omit } from 'lodash';
import { Colors } from '../../../../../../ui/layout/theme-next';

export default makeStyles((theme) => ({
  root: {
    width: 350,
  },
  rootFocused: {
    width: '100%',
  },
  popperFocused: {
    width: '100%',
  },
  listPaper: {
    ...omit(theme.overrides?.MuiMenu?.paper, 'boxShadow'),
    boxShadow: theme.shadows[2],
    marginTop: theme.spacing(-5),
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(1),
  },
  listOption: {
    minHeight: 30,
  },
  inputFocused: {
    border: 'none',
    background: 'none',
    zIndex: 1301,
  },
  listGroupLabel: {
    ...theme.typography.h6,
    padding: theme.spacing(1.25, 2),
    borderTop: `1px solid ${Colors.stroke}`,
    backgroundColor: Colors.white,
  },
  listGroupAllLabel: {
    height: 0,
    padding: theme.spacing(0.25, 0),
    margin: theme.spacing(0.25, 2, 0),
  },
  viewAll: {
    ...theme.typography.h6,
    padding: theme.spacing(0.5, 0),
    margin: theme.spacing(0.25, 2, 0),
    color: Colors.textGray,
  },
  listGroup: {
    padding: 0,
  },
  listGroupAll: {
    fontWeight: 600,
    fontSize: 12,
  },
  iconFocused: {
    color: Colors.textBlack,
  },
}));
