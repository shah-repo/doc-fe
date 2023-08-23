import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles((theme) => ({
  root: {
    pointerEvents: 'none',
  },
  paper: {
    pointerEvents: 'auto',
    width: '50%',
    maxWidth: '50%',
    minHeight: '70vh',
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
  list: {
    listStyle: 'none',
    padding: 0,
  },
  parentListItem: {
    marginBottom: theme.spacing(1.5),
    marginLeft: theme.spacing(1.375),
  },
  listItem: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1.375),
  },
  check: {
    marginRight: theme.spacing(1),
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
    backgroundColor: Colors.navy,
    color: Colors.white,
    '&:hover': {
      background: Colors.navy,
    },
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
    padding: theme.spacing(2.5),
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
    color: Colors.navy,
  },
}));
