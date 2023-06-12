import { makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';

export default makeStyles((theme) => ({
  form: {
    minWidth: 400,
  },
  formLoading: {
    height: 20,
    overflow: 'hidden',
    margin: theme.spacing(-2.5, -2.5, 2, -3),
  },
  submitButton: {
    float: 'right',
    clear: 'right',
  },
  cancelButton: {
    float: 'right',
    marginRight: theme.spacing(1),
  },
  passwordInput: {
    height: 40,
    marginTop: '0 !important',
  },
  dropDown: {
    top: '2px !important',
    width: '161px',
    left: '-10px',
  },
  buttonHover: {
    '&:hover': {
      backgroundColor: `${Colors.light_gray} !important`,
      borderTopLeftRadius: '100px',
    },
    '&:disabled': {
      backgroundColor: `${Colors.gray_goose} !important`,
      color: `${Colors.gray} !important`,
    },
    'borderTopLeftRadius': '100px',
    'borderBottomLeftRadius': '100px',
  },
  hoverArrow: {
    '&:hover': {
      backgroundColor: `${Colors.light_gray} !important`,
      borderTopRightRadius: '100px',
    },
    'borderTopRightRadius': '100px',
    'borderBottomRightRadius': '100px',
  },
  button: {
    margin: theme.spacing(0, 1),
  },
  dialog: {
    width: '100%',
    maxWidth: 500,
  },
  dialogPaper: {
    overflowY: 'unset',
  },
  dialogTitle: {
    paddingBottom: theme.spacing(1.75),
    fontSize: 14,
    fontWeight: 600,
  },
  dialogContent: {
    overflowY: 'unset',
    paddingTop: theme.spacing(1.5),
    borderTop: `1px solid ${Colors.light_gray}`,
  },
  dialogActions: {
    backgroundColor: Colors.white_smoke,
    display: 'flex',
    justifyContent: 'flex-end',
    columnGap: theme.spacing(1),
    margin: theme.spacing(1, -2.5, -2.5, -3),
    padding: theme.spacing(2.5, 2.5, 2.5, 3),
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  releaseButton: {
    'border': `1px solid ${Colors.white}`,
    'backgroundColor': Colors.white,
    'color': Colors.navy,
    'borderRadius': '100px',
    '&:hover': {
      backgroundColor: Colors.white,
      borderColor: Colors.white,
    },
  },
}),
);
