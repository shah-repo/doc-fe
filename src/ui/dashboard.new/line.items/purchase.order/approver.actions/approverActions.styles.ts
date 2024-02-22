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
  truncateMobile: {
    overFlow: 'unset',
  },
  gridApproveMobile: {
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
    truncateMobile: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      wordBreak: 'break-all',
    },
    link: {
      pointerEvents: 'none',
    },
    gridApproveMobile: {
      display: 'flex',
      marginLeft: theme.spacing(2),
    },
    poActionIconsWidth: {
      display: 'none',
    },
  },
}));
