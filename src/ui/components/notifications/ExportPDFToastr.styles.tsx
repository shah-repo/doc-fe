import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) => ({
  dialogAction: {
    justifyContent: 'space-between',
  },
  popup: {
    borderRadius: theme.spacing(0.75),
    border: `1px solid ${Colors.primaryLight} !important`,
    borderLeft: `7px solid ${Colors.primaryLight} !important`,
    background: `${Colors.primaryHighlight} !important`,
    padding: theme.spacing(1.875),
    height: 97,
    '& .Toastify__close-button': {
      margin: theme.spacing(0),
      alignSelf: 'flex-start !important',
      color: `${Colors.primaryLight} !important`,
    },
  },
  popupBody: {
    display: 'flex',
    padding: theme.spacing(0),
    gap: theme.spacing(1.875),
    width: 720,
  },
  popupTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: theme.spacing(1.25),
  },
  popupInfoIcon: {
    marginTop: theme.spacing(1.375),
    color: Colors.primaryLight,
  },
}));
