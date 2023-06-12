import { makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export default makeStyles((theme: Theme) => ({
  statusIcon: {
    height: 7,
    width: 7,
    marginRight: theme.spacing(1),
    borderRadius: '50%',
  },
  OPENED: {
    backgroundColor: Colors.dodger_blue,
  },
  CLOSED: {
    backgroundColor: Colors.font_gray,
  },
  VOIDED: {
    backgroundColor: Colors.latest_red_varient,
  },
  menu: {
    marginTop: 5,
    boxSizing: 'border-box',
    boxShadow: '0px 10px 30px rgba(22, 34, 41, 0.15)',
    borderRadius: 4,
  },
  menuItem: {
    backgroundColor: Colors.white,
    color: Colors.almost_black,
    fontWeight: 400,
    fontSize: '14px',
    width: 160,
    height: 48,
    padding: theme.spacing(0, 1.5),
  },
  buttonGroup: {
    height: 36,
    margin: 0,
    padding: 0,
  },
  defaultGroupButton: {
    'margin': 0,
    'padding': 0,
    'backgroundColor': Colors.white,
    '&:hover': {
      background: Colors.white,
    },
  },
  textBtn: {
    width: 76,
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    color: Colors.almost_black,
  },
  iconBtn: {
    minWidth: 37,
    padding: theme.spacing(1.25, 1.5, 1.25, 1.25),
    borderLeft: `1px solid ${Colors.gray_goose}`,
    borderRadius: '0px 4px 4px 0px',
  },
}));
