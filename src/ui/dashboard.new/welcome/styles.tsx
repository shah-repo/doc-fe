import { makeStyles } from '@material-ui/core';
import EnlilLogo from '../../../assets/images/enlil_logo.svg';
import { HEADER_HEIGHT } from '../../app/Header.styles';
import { Colors } from '../../layout/theme-next';
import { GRADIENT } from '../../layout/theme-next/consts';
import { NextTheme } from '../../layout/theme-next/provider';

export default makeStyles<NextTheme>(theme => ({
  root: {
    padding: theme.spacing(4, 4, 12),
    background: GRADIENT,

    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2.5, 2.5, 10),
    },

    [theme.media.mobile]: {
      padding: theme.spacing(1.5, 1.5, 8.5),
    },

    '&::before': {
      content: "''",
      position: 'absolute',
      width: '20vw',
      right: 0,
      top: 0,
      bottom: 0,
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${EnlilLogo})`,
      backgroundPosition: `left -${HEADER_HEIGHT}px`,

      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  },
  text: {
    color: Colors.white,
    fontSize: '1.75rem',
    lineHeight: 1.2,
    fontWeight: 300,
    flexGrow: 1,
    marginRight: theme.spacing(4),

    [theme.breakpoints.down('md')]: {
      fontSize: '1.5rem',
    },
    [theme.media.mobile]: {
      fontSize: '1.2rem',
    },
  },
  name: {
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
}));
