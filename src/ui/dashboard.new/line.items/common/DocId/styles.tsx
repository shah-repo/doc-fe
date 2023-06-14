import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';

export const styles = makeStyles(() =>
  createStyles({
    link: {
      'color': Colors.black,
      'textDecoration': 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    margin5: {
      marginRight: '5px',
    },
    typography: {
      fontSize: '14px',
      fontWeight: 400,
      letterSpacing: 0,
    },
  }),
);
