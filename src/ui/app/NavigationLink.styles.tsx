import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../layout/theme/utils/colors';

export default makeStyles((theme: Theme) =>
  createStyles({
    link: {
      height: 45,
      color: Colors.white,
      backgroundColor: Colors.mirage,
      borderBottom: '1px solid transparent',
      opacity: 0.69,
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        color: Colors.white,
        backgroundColor: Colors.bright_grey,
        borderBottom: '1px solid',
        borderImage: `linear-gradient(270deg, ${Colors.cerulean} 0.17%, ${Colors.peri_winkle_blue} 74.99%, ${Colors.navy} 109.83%)`,
        borderImageSlice: 1,
        opacity: 1,
      },
    },
    childLink: {
      paddingLeft: theme.spacing(5),
    },
    activeLink: {
      backgroundColor: Colors.bright_grey,
      color: Colors.white,
    },
    itemIcon: ({ iconLink, open }) => ({
      color: 'inherit',
      minWidth: 31,
      alignContent: open ? 'flex-start' : 'center',
      justifyContent: open ? 'flex-start' : 'center',
    }),
    itemText: {
      color: Colors.white,
      fontSize: 13,
      fontWeight: 400,
    },
    menu: {
      borderbottom: '1px solid transparent',
    },
    icon: ({ iconLink }) => ({
      width: 16,
      height: 16,
      backgroundColor: Colors.white,
      mask:
        `url(${iconLink}) no-repeat center / contain`,
      '-webkit-mask':
        `url(${iconLink}) no-repeat center / contain`,
    }),
    iconActive: ({ iconLink, open, isParent }) => ({
      background: open || isParent ? `${Colors.white} !important` : 'linear-gradient(0deg, rgba(1, 166, 199, 0.3), rgba(1, 166, 199, 0.3))',
    }),
    collapsedIcon: {
      padding: theme.spacing(1.25),
      borderRadius: 3,
    },
    childTextItem: {
      paddingLeft: theme.spacing(0.875),
    },
    otherChildMenus: {
      background: `${Colors.mirage} !important`,
    },
    childMenuItems: {
      color: Colors.light_gray,
    },
    childMenuActive: {
      color: Colors.white,
      background: `linear-gradient(0deg, rgba(1, 166, 199, 0.3), rgba(1, 166, 199, 0.3)),${Colors.almost_black} !important`,
    },
    parentMenuItem: {
      color: Colors.white,
      background: `${Colors.mirage} !important`,
      padding: theme.spacing(0.75, 1.25),
      borderRadius: 4,
    },
    popover: {
      pointerEvents: 'auto',
    },
    popoverContent: {
      pointerEvents: 'none',
    },
    menuDivSeparator: {
      height: 5,
    },
    childMenuLabel: {
      opacity: 0.7,
    },
  }),
);
