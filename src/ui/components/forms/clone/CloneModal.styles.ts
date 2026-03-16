import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

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
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: '76px',
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
      fontSize: '12px',
      lineHeight: '15px',
    },
    radioGroup: {
      marginBottom: theme.spacing(1),
    },
    radio: {
      paddingTop: 11,
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
    checked: {},
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
