import { makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme-next/colors';
import { NextTheme } from '../../../../layout/theme-next/provider';
import { grayDotStyles, lineItemStyles } from '../../common/styles';

export default makeStyles((theme: NextTheme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  textPoReviewlapMobile: {
    flexWrap: 'nowrap',
  },
  gridPendingMobile: {
    display: 'none',
    backgroundColor: Colors.primaryHighlight,
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > button': {
      borderRadius: 25,
      color: Colors.white,
      padding: theme.spacing(1.5, 3),
      '& svg': {
        marginRight: theme.spacing(0.5),
      },
    },
  },
  poActionIconsWidth: {
    display: 'flex',
  },
  downloadButton: {
    background: Colors.textGray,
    '&:hover': {
      background: Colors.textGray,
    },
  },
  [theme.media.mobile]: {
    textPoReviewlapMobile: {
      flexWrap: 'wrap',
    },
    link: {
      pointerEvents: 'none',
    },
    actionIcons: {
      display: 'none',
    },
    gridPendingMobile: {
      display: 'flex',
      marginLeft: theme.spacing(2),
    },
    poActionIconsWidth: {
      display: 'none',
    },
    typographyChildrenBold: {
      marginLeft: theme.spacing(-2),
    },
  },
}));
