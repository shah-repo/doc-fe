import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) =>
  createStyles({
    typographyBold: {
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: 0,
    },
    margin5: {
      marginRight: '5px',
    },
    link: {
      color: Colors.black,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    [theme.breakpoints.down('xs')]: {
      link: {
        pointerEvents: 'none',
      },
    },
  }),
);
