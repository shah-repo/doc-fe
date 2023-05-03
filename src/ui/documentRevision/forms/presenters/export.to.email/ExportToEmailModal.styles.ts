import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      position: 'relative',
      width: '660px',
      height: '291px',
      background: Colors.white,
      borderRadius: '6px',
    },
    header: {
      width: '660px',
      height: '58px',
      marginLeft: '-20px',
      boxShadow: `0px 1px 0px ${Colors.medium_gray}`,
    },
    footer: {
      display: 'flex',
      flexDirection: 'row',
      'justify-content': 'flex-end',
      alignItems: 'center',
      padding: '20px 20px 20px 0px',
      position: 'absolute',
      width: '660px',
      height: '76px',
      right: '0px',
      bottom: '0px',
      background: Colors.white_smoke,
      borderRadius: '0px 0px 6px 6px',
    },
    buttonContinue: {
      width: '100px',
      height: '36px',
      borderRadius: '200px',
      backgroundColor: Colors.navy,
      color: Colors.white,
      '&:hover': {
        background: Colors.navy,
      },
    },
    buttonCancel: {
      width: '100px',
      height: '36px',
      borderRadius: '200px',
      backgroundColor: Colors.white,
      color: Colors.navy,
      '&:hover': {
        background: Colors.white,
      },
    },
    title: {
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '18px',
      color: Colors.almost_black,
    },
    headertitle: {
      position: 'static',
      marginLeft: '20px',
    },
    contenttitle: {
      position: 'static',
      paddingTop: 29,
      marginLeft: '35px',
      fontSize: '12px',
      lineHeight: '15px',
    },
    radio: {
      paddingTop: 11,
      marginLeft: '35px',
      '&:hover': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
      '&$checked': {
        color: Colors.navy,
        '&:hover': {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    closemodel: {
      right: '20px',
      height: '30px',
      borderRadius: '6px',
    },
    radioLabel: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px',
      color: Colors.almost_black,
    },
    buttonLabel: {
      fontWeight: 700,
      fontSize: '12px',
      lineHeight: '15px',
    },
  }),
);
