import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles((theme) => ({
  root: {
    pointerEvents: 'none',
  },
  paper: {
    pointerEvents: 'auto',
    width: '80%',
    maxWidth: '80%',
    minHeight: '80vh',
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
  },
  listItem: {
    marginBottom: '8px',
  },
  check: {
    marginRight: '8px',
  },
  parentRevHeading: {
    background: Colors.gray_goose,
    padding: '8px',
    borderRadius: '4px',
  },
  dialogAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    height: '76px',
    background: Colors.white_smoke,
  },
  buttonLabel: {
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '15px',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    padding: '10.5px 20px',
  },
  submitButton: {
    height: '36px',
    borderRadius: '100px',
    backgroundColor: Colors.navy,
    color: Colors.white,
    '&:hover': {
      background: Colors.navy,
    },
  },
  cancelButton: {
    height: '36px',
    borderRadius: '100px',
    backgroundColor: Colors.white,
    color: Colors.navy,
    '&:hover': {
      background: Colors.white,
      boxShadow:
        '0px 2px 4px -1px rgb(0 0 0 / 5%), 0px 4px 5px 0px rgb(0 0 0 / 5%), 0px 1px 10px 0px rgb(0 0 0 / 5%)',
    },
  },
}));
