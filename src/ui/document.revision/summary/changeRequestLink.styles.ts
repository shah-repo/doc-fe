import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles((theme) =>
  createStyles({
    link: {
      textDecoration: 'none',
      fontSize: '14px',
    },

    listItemPadding: {
      padding: 0,
      paddingTop: theme.spacing(1),
    },

    viewIcon: {
      'fill': Colors.hint_gray,
      'position': 'relative',
      'left': theme.spacing(-2),
      'opacity': 0,
      'fontSize': '1.2rem',
      'cursor': 'pointer',

      'transition': 'left 0.3s ease-out, opacity 0.2s ease-in',
      '&:hover': {
        fill: Colors.black,
      },
    },

    linkContainer: {
      'display': 'flex',
      'alignItems': 'center',

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
