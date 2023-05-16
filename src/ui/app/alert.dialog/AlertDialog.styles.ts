import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      'height': '36px',
      'borderRadius': '100px',
      'backgroundColor': Colors.navy,
      'color': Colors.white,
      '&:hover': {
        background: Colors.navy,
      },
    },
    cancelButton: {
      'height': '36px',
      'borderRadius': '100px',
      'backgroundColor': Colors.white,
      'color': Colors.navy,
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
      'display': 'flex',
      'justify-content': 'flex-end',
      'alignItems': 'center',
      'padding': '20px 20px 20px 0px',
      'height': '76px',
      'background': Colors.white_smoke,
    },
    contentContainer: {
      flexWrap: 'nowrap',
      padding: '20px',
    },
    alertIcon: {
      marginTop: '2px',
      paddingRight: '20px',
    },
    alertTitle: {
      fontWeight: 600,
      fontSize: '18px',
      lineHeight: '23px',
      color: Colors.almost_black,
      width: '378px',
    },
    contentText: {
      'fontWeight': 400,
      'fontSize': '14px',
      'lineHeight': '21px',
      'color': Colors.almost_black,
      'paddingTop': '10px',
      'white-space': 'break-spaces',
    },
  }),
);
