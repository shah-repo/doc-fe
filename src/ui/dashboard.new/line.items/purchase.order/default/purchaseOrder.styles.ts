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
  typographyChildrenBold: {
    fontSize: 14,
    fontWeight: 700,
  },
  gridMobile: {
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
  poAttachmentMargin: {
    marginBottom: theme.spacing(0),
  },
  textPoReviewlapMobile: {
    flexWrap: 'nowrap',
  },
  [theme.media.mobile]: {
    poActionIconsWidth: {
      display: 'none',
    },
    textPoReviewlapMobile: {
      flexWrap: 'wrap',
    },
    link: {
      pointerEvents: 'none',
    },
    gridMobile: {
      display: 'flex',
      marginLeft: theme.spacing(2),
    },
    typographyChildrenBold: {
      marginLeft: theme.spacing(-2),
      paddingRight: theme.spacing(2),
    },
    poAttachmentMargin: {
      marginBottom: theme.spacing(2),
    },
  },
}));
