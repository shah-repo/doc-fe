import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles((theme) =>
  createStyles({
    arLinkContainer: {
      fontSize: 14,
      fontWeight: 600,
      lineHeight: '25px',
    },
    link: {
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: 600,
    },

    listItemPadding: {
      padding: 0,
      paddingBottom: theme.spacing(1),
    },

    viewIcon: {
      fill: Colors.hint_gray,
      position: 'relative',
      left: theme.spacing(-2),
      opacity: 0,
      top: 5,
      fontSize: '1.2rem',
      cursor: 'pointer',

      transition: 'left 0.3s ease-out, opacity 0.2s ease-in',
      '&:hover': {
        fill: Colors.black,
      },
    },

    linkContainer: {
      alignItems: 'center',

      '&:hover': {
        '& a': {
          textDecoration: 'underline',
        },
        '& svg': {
          left: theme.spacing(1),
          opacity: 1,
        },
      },
    },
  }),
);
