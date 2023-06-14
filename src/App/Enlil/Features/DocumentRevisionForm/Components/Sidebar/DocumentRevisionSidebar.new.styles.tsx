import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../../../../../ui/layout/theme/utils/colors';

export default makeStyles(() =>
  createStyles({
    sidebar: {
      transition: 'all .2s ease-out',
      background: Colors.white,
      filter: 'drop-shadow(0px 4px 24px rgba(22, 34, 41, 0.06))',
      borderRadius: 6,
      marginRight: 10,
      marginTop: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    sidebarOpened: {
      transition: 'all .2s ease-in',
    },
    iconBox: {
      minWidth: 48,
      display: 'flex',
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBoxOpened: {
      borderRight: `1px solid ${Colors.light_gray_border}`,
    },
    iconButtonNew: {
      'width': 36,
      'height': 30,
      'padding': 0,
      '&:hover, &:focus, li.active > a': {
        'background': Colors.light_blue,
        'borderRadius': 5,
        '& svg': {
          stroke: Colors.medium_blue,
        },
      },
      '& svg': {
        stroke: Colors.hint_gray,
      },
      '&.maximize': {
        transform: 'scaleX(-1)',
      },
    },
    tabTitle: {
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '18px',
      color: Colors.dark_jungle_green,
    },
  }),
);
