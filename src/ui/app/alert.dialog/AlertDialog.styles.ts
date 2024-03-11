import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme-next/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      height: 36,
      borderRadius: '100px',
      backgroundColor: Colors.primary,
      color: Colors.white,
      '&:hover': {
        background: Colors.primary,
      },
    },
    cancelButton: {
      height: 36,
      borderRadius: '100px',
      backgroundColor: Colors.white,
      color: Colors.primary,
      '&:hover': {
        background: Colors.white,
        boxShadow:
          '0px 2px 4px -1px rgb(0 0 0 / 5%), 0px 4px 5px 0px rgb(0 0 0 / 5%), 0px 1px 10px 0px rgb(0 0 0 / 5%)',
      },
    },
    buttonLabel: {
      fontWeight: 700,
      fontSize: '12px',
      lineHeight: '15px',
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
      padding: '10.5px 20px',
    },
    dialogAction: {
      display: 'flex',
      'justify-content': 'flex-end',
      alignItems: 'center',
      padding: theme.spacing(2.5, 2.5, 2.5, 0),
      height: 76,
      background: Colors.gray,
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
      fontSize: '18px',
      lineHeight: '23px',
      color: Colors.textBlack,
      width: 378,
    },
    contentText: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '21px',
      color: Colors.textBlack,
      paddingTop: theme.spacing(1.25),
      'white-space': 'break-spaces',
    },
    descriptionField: {
      paddingTop: theme.spacing(2),
    },
    loading: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      background: Colors.whiteDimmed,
    },
  }),
);
