import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../layout/theme/utils/colors';

export default makeStyles((theme: Theme) =>
  createStyles({
    link: {
      'color': Colors.white,
      'backgroundColor': Colors.mirage,
      'border-bottom': '1px solid transparent',
      '&:hover': {
        color: Colors.white,
        backgroundColor: Colors.bright_grey,
        borderBottom: '1px solid',
        borderImage: `linear-gradient(270deg, ${Colors.cerulean} 0.17%, ${Colors.peri_winkle_blue} 74.99%, ${Colors.navy} 109.83%)`,
        borderImageSlice: 1,
      },
      '& svg': {
        stroke: Colors.white,
        fontSize: '1.2rem',
      },
    },
    childLink: {
      paddingLeft: theme.spacing(6),
    },
    activeLink: {
      'backgroundColor': Colors.bright_grey,
      'color': Colors.white,
      '& .MuiListItemText-primary': {
        fontWeight: 'bold',
      },
      '&:hover': {
        backgroundColor: Colors.bright_grey,
        color: Colors.white,
      },
      '& svg': {
        stroke: Colors.white,
      },
    },
    itemIcon: {
      color: 'inherit',
      minWidth: '40px',
    },
    itemText: {
      color: 'inherit !important',
      letterSpacing: 0,
      fontSize: '13px',
    },
    menu: {
      paddingTop: 4,
      paddingBottom: 4,
      marginTop: 5,
      fontSize: '11px',
      borderbottom: '1px solid transparent',
    },
    icon: ({ iconLink }) => ({
      'width': 20,
      'height': 20,
      'backgroundColor': Colors.white,
      'mask':
        `url(${iconLink}) no-repeat center / contain`,
      '-webkit-mask':
        `url(${iconLink}) no-repeat center / contain`,
    }),
    iconActive: {
      backgroundColor: `${Colors.white} !important`,
    },
  })
);
