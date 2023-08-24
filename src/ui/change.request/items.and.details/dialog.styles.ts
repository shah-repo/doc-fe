import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles((theme) => ({
  root: {
    pointerEvents: 'none',
  },
  paper: {
    pointerEvents: 'auto',
    width: '40%',
    maxWidth: '40%',
  },
  close: {
    height: 24,
    width: 24,
    backgroundColor: Colors.athens_gray,
    borderRadius: theme.spacing(0.75),
    margin: theme.spacing(0, 1.25),
  },
  content: {
    padding: 0,
  },
  actions: {
    padding: 0,
    backgroundColor: Colors.white,
  },
  heading: {
    fontWeight: 700,
    fontSize: 14,
    flex: 1,
    color: Colors.almost_black,
  },
  parentList: {
    listStyle: 'none',
    padding: 0,
  },
  list: {
    padding: 0,
    maxHeight: '39vh',
    overflowX: 'auto',
  },
  parentListItem: {
    marginBottom: theme.spacing(2.5),
    marginLeft: theme.spacing(1.375),
  },
  listItem: {
    marginBottom: theme.spacing(1.25),
    marginLeft: theme.spacing(1.375),
  },
  check: {
    marginRight: theme.spacing(1),
    backgroundColor: Colors.dodger_blue,
  },
  dialogAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right',
    padding: theme.spacing(2.5),
    height: 76,
    background: Colors.white_smoke,
  },
  buttonLabel: {
    fontWeight: 700,
    fontSize: 12,
    lineHeight: '15px',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    padding: theme.spacing(1.31, 2.5),
  },
  submitButton: {
    height: 36,
    borderRadius: theme.spacing(12.5),
    backgroundColor: Colors.dodger_blue,
    color: Colors.white,
    '&:hover': {
      background: Colors.dodger_blue,
    },
  },
  checkbox: {
    color: Colors.almost_black,
    '&$checked': {
      color: Colors.dodger_blue,
    },
  },
  checked: {
    color: Colors.almost_black,
  },
  cancelButton: {
    height: 36,
    borderRadius: theme.spacing(12.5),
    marginRight: theme.spacing(1),
    backgroundColor: Colors.white,
    color: Colors.navy,
    '&:hover': {
      background: Colors.white,
      boxShadow:
        '0px 2px 4px -1px rgb(0 0 0 / 5%), 0px 4px 5px 0px rgb(0 0 0 / 5%), 0px 1px 10px 0px rgb(0 0 0 / 5%)',
    },
  },
  contentContainer: {
    flexWrap: 'nowrap',
    padding: theme.spacing(2.5, 2.5, 0, 2.5),
  },
  alertIcon: {
    marginTop: theme.spacing(0.25),
    paddingRight: theme.spacing(2.5),
  },
  alertTitle: {
    fontWeight: 600,
    fontSize: 18,
    color: Colors.almost_black,
  },
  contentText: {
    fontWeight: 400,
    fontSize: 14,
    color: Colors.almost_black,
    paddingTop: 10,
    'white-space': 'break-spaces',
  },
  infoIcon: {
    width: 24,
    height: 23,
    color: Colors.dodger_blue,
  },
  blackDot: {
    width: 4,
    height: 4,
    right: 4,
    position: 'relative',
    background: Colors.black,
  },
  ml5: {
    marginLeft: theme.spacing(0.625),
  },
  timestampContainer: {
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '22px',
  },
  dotContainer: {
    marginLeft: theme.spacing(1.5),
  },
}));
