import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'start',
      flexDirection: 'row',
      gap: `${theme.spacing(1)}px`,
      paddingTop: theme.spacing(1.5),
      fontWeight: 400,
      color: Colors.almost_black,
    },
    submitButton: {
      height: 36,
      borderRadius: '100px',
      backgroundColor: Colors.navy,
      color: Colors.white,
      '&:hover': {
        background: Colors.navy,
      },
    },
    cancelButton: {
      height: 36,
      borderRadius: '100px',
      backgroundColor: Colors.white,
      color: Colors.navy,
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
      background: Colors.white_smoke,
    },
    contentContainer: {
      flexWrap: 'nowrap',
      padding: theme.spacing(2.5),
    },
    alertIcon: {
      marginTop: theme.spacing(0.25),
      paddingRight: theme.spacing(2.5),
    },
    warningIcon: {
      width: 25,
      height: 25,
      color: Colors.light_yellow_warning,
    },
    infoIcon: {
      width: 25,
      height: 25,
      color: Colors.dodger_blue,
    },
    alertTitle: {
      fontWeight: 600,
      fontSize: '18px',
      lineHeight: '23px',
      color: Colors.almost_black,
      width: 378,
    },
    contentText: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '21px',
      color: Colors.almost_black,
      paddingTop: theme.spacing(1.25),
      'white-space': 'break-spaces',
    },
  }),
);
