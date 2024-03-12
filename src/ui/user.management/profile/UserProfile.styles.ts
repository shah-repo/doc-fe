import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles((theme: Theme) =>
  createStyles({
    positionFixed: {
      position: 'relative',
    },
    appBar: {
      backgroundColor: '#29064C',
      height: '330px',
    },
    iconButton: {
      color: 'white',
    },
    userProfile: {
      color: 'white',
      fontSize: '1.3rem',
    },
    userName: {
      color: 'white',
      fontSize: '1.9rem',
      marginTop: theme.spacing(1),
    },
    userNameEdit: {
      '& .MuiInputBase-input': {
        color: theme.palette.common.white,
        fontSize: '3rem',
        textAlign: 'center',
        padding: theme.spacing(0.5, 0, 0.5, 0),
      },
      '& .MuiInput-underline': {
        '&:before': {
          borderBottom: `1px solid ${theme.palette.common.white}`,
          transition: 'none',
        },
        '&:after': {
          borderBottom: `1px solid ${theme.palette.common.white}`,
          transition: 'none',
        },
        '&:hover:not(.Mui-disabled):before': {
          borderBottom: `1px solid ${theme.palette.common.white}`,
        },
        '&.Mui-error:after': {
          borderBottom: `1px solid ${'#c40000'}`,
        },
      },
    },
    activeStatusButton: {
      width: 'auto',
      color: '#6E09EA',
      borderColor: '#6E09EA',
    },
    title: {
      fontSize: '1rem',
      lineHeight: '1.6',
      letterSpacing: '0.0075em',
      fontWeight: 'bold',
      color: Colors.dark_gray,
      margin: theme.spacing(3, 0, 1),
    },
    addButton: {
      display: 'flex',
      margin: 0,
    },
  }),
);
