import { makeStyles } from '@material-ui/core/styles';
import { omit } from 'lodash';
import { Colors } from '../../../../../../ui/layout/theme-next';
import { NextTheme } from '../../../../../../ui/layout/theme-next/provider';

export default makeStyles<NextTheme>(theme => ({
  root: {
    maxWidth: 350,
    margin: 'auto',
  },
  rootFocused: {
    width: '100%',
    maxWidth: 'none',
  },
  popperFocused: {
    width: '100%',
  },
  listPaper: {
    ...omit(theme.overrides?.MuiMenu?.paper, 'boxShadow'),
    boxShadow: theme.shadows[2],
    marginTop: theme.spacing(-3.75),
    paddingTop: theme.spacing(4.375),
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
    padding: theme.spacing(1.25, 1.5),
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
