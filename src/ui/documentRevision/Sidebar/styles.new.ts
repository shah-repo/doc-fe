import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

const SIDEBAR_WIDTH = 300;

export default makeStyles((theme) =>
  createStyles({
    iconBar: (isDrawerOpen: boolean) => ({
      width: 48,
      borderRight: isDrawerOpen ? `1px solid ${Colors.light_gray_border}` : 'none',
    }),
    changeContainer: {
      boxShadow: `inset 0px 1px 1px -1px ${Colors.gray_goose}, inset 0px -1px 1px 0px ${Colors.gray_goose}`,
      padding: theme.spacing(1.875),
    },
    listItem: {
      'padding': 0,
      '& .MuiListItemAvatar-root': {
        maxWidth: '35px',
        minWidth: '35px',
        marginRight: '8px',
      },
    },
    drawerPaper: {
      marginTop: 105,
      position: 'fixed',
      height: '100%',
      overflow: 'auto',
      width: SIDEBAR_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      width: 60,
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    drawerInner: {
      width: SIDEBAR_WIDTH,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      minHeight: 10,
    },
    sidebarList: {
      height: '100%',
      overflow: 'auto',
      paddingRight: 17,
      minWidth: '100%',
    },
    menuIcon: {
      'margin': '8px 13px 13px 11px',
      'paddingTop': 5,
      'paddingBottom': 5,
      'justifyContent': 'unset',
      '&:hover': {
        background: 'none',
      },
    },
    iconButton: {
      'margin': '8px 13px 13px 11px',
      'paddingTop': 5,
      'paddingBottom': 5,
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
    },
    iconButtonNew: {
      'width': 36,
      'height': 30,
      'padding': 0,
      'margin': '9px 6px 0px 6px',
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
    },
    titleOfRevision: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
      fontWeight: theme.typography.fontWeightBold,
    },
    avatar: {
      width: 35,
      height: 35,
      fontSize: 12,
      fontWeight: 600,
      color: Colors.white,
      textTransform: 'uppercase',
    },
    secondaryText: {
      fontSize: 12,
      color: Colors.font_gray,
    },
    generalInfo: {
      fontWeight: 600,
      fontSize: 14,
      lineHeight: 1.5,
      color: Colors.almost_black,
    },
    linkButton: {
      textDecoration: 'none',
      color: Colors.navy,
      fontSize: 14,
    },
    references: {
      overflowX: 'hidden',
      overflowY: 'auto',
      flexGrow: 1,
    },
    bgIsActiveTab: {
      'background': Colors.light_blue,
      'borderRadius': 5,
      '& svg': {
        stroke: Colors.medium_blue,
      },
    },
  }),
);
