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
        color: Colors.font_gray,
      },
      text: {
        color: Colors.font_gray,
      },
    },
  });
