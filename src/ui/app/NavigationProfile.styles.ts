import { createStyles } from '@material-ui/core';
import { NextTheme } from '../layout/theme-next/provider';
import Colors from '../layout/theme/utils/colors';

export default (theme: NextTheme) =>
  createStyles({
    headerButton: {
      alignItems: 'baseline',
      width: '100%',
      boxShadow: 'none',
      textTransform: 'none',
      padding: 0,
      margin: 0,
      '&:hover': {
        background: 'none',
        boxShadow: 'none',
      },
      display: 'unset',
    },
    bottomPush: {
      padding: theme.spacing(0.625, 1.25, 2.5, 1.875),
    },
    collapsedBottomPush: {
      padding: 0,

      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(0.625, 1.25, 2.5, 1.875),
      },
    },
    emailPosition: {
      flexFlow: 'nowrap',
      display: 'flex',
      position: 'relative',
      width: '100%',
    },
    emailStyle: {
      fontWeight: 400,
      fontSize: 12,
      color: Colors.dark_gray2,
    },
    nameStyle: {
      fontWeight: 600,
      fontSize: 12,
      color: Colors.white,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    list: {
      width: '98%',
      padding: 0,
      margin: 0,
    },
    listItem: {
      padding: 0,
    },
    collapsedListItem: {
      padding: theme.spacing(0.625, 0.875, 0, 1.875),
    },
    listItemAvatar: {
      minWidth: 38,
    },
    mobileUserProfile: {
      display: 'none',
    },
    [theme.media.mobile]: {
      mobileUserProfile: {
        background: 'rgba(255, 255, 255, 0.07)',
        borderRadius: 10,
        display: 'block',
        width: 225,
      },
      headerButton: {
        display: 'none',
      },
      emailStyle: {
        fontSize: 9,
      },
      listItemIcon: {
        color: Colors.dark_gray2,
        minWidth: 30,
      },
      text: {
        color: Colors.dark_gray2,
        fontSize: 14,
        fontWeight: 400,
      },
      hrLine: {
        backgroundColor: Colors.dark_gray2,
        width: 200,
        marginLeft: 12,
        marginTop: 10,
        marginBottom: 10,
      },
      userSideProfile: {
        height: 40,
        paddingLeft: theme.spacing(0.5),
      },
    },
  });
