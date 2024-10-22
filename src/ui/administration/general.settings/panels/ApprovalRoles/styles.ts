import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => createStyles({
  dialogTitle: {
    justifyContent: 'normal',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(4),
    '& .MuiTypography-h6': {
      display: 'flex',
      color: Colors.black,
    },
  },
  dialogContent: {
    marginLeft: theme.spacing(5),
    paddingTop: theme.spacing(1),
    color: Colors.black,
  },
  dialogAction: {
    backgroundColor: Colors.gray,
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
  },
  infoIcon: {
    width: 25,
    height: 25,
    color: Colors.primaryLight,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: theme.spacing(2),
  },
  bottomText: {
    marginTop: theme.spacing(2),
  },
  link: {
    textDecoration: 'unset',
    color: Colors.primary,
  },
  okBtn: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    borderRadius: 25,
    height: '36px',
    width: '100px',
    '&:hover': {
      backgroundColor: Colors.primaryDark,
    },
    margin: 0,
  },
  alertTitle: {
    justifyContent: 'normal',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(2),
    '& .MuiTypography-h6': {
      display: 'flex',
      color: Colors.black,
    },
  },
  alertContent: {
    marginLeft: theme.spacing(5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    color: Colors.black,
  },
  alertIcon: {
    width: 25,
    height: 25,
    color: Colors.error,
  },
  alertRoot: {
    position: 'initial',
  },
  alertPaper: {
    backgroundColor: Colors.errorHighlight,
    border: `1px solid ${Colors.error}`,
    borderLeftWidth: '7px',
    position: 'absolute',
    top: 20,
  },
}));
