import { createStyles, Theme } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default (theme: Theme) =>
  createStyles({
    form: {
      minWidth: 400,
    },
    submitButton: {
      float: 'right',
      clear: 'right',
    },
    cancelButton: {
      float: 'right',
      marginRight: theme.spacing(1),
      '& span': {
        color: Colors.primary,
        fontWeight: 600,
      },
    },
    labelContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: theme.spacing(2.5),
    },
    label: {
      fontWeight: 600,
      fontSize: 12,
      color: Colors.textBlack,
      lineHeight: '15px',
      marginBottom: theme.spacing(1.25),
    },
    inputFieldWrap: {
      marginTop: `${theme.spacing(0)}px !important`,
    },
    inputField: {
      fontSize: 'inherit',
      padding: theme.spacing(1.5),
    },
  });
