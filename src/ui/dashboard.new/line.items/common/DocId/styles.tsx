import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme/utils/colors';
import { NextTheme } from '../../../../layout/theme-next/provider';

export const styles = makeStyles((theme: NextTheme) =>
  createStyles({
    link: {
      color: Colors.black,
      textDecoration: 'none',
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
    [theme.media.mobile]: {
      link: {
        pointerEvents: 'none',
      },
    },
  }),
);
