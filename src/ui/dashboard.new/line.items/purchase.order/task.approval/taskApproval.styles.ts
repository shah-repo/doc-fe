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
  poActionIconsWidth: {
    width: 146,
  },
  nonPoActionIconsWidth: {
    width: 112,
  },
  innerWrap: {
    display: 'inline-flex',
  },
  gridMobile: {
    display: 'none',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > button': {
      borderRadius: 25,
      color: Colors.white,
      padding: `${theme.spacing(1.5)}px ${theme.spacing(3)}px`,
      '& svg': {
        marginRight: theme.spacing(0.5),
      },
    },
  },
  rejectButton: {
    display: 'none',
  },
  approvalButton: {
    display: 'none',
  },
  downloadButton: {
    background: Colors.textGray,
    '&:hover': {
      background: Colors.textGray,
    },
  },
  buttoncursor: {
    paddingLeft: 1,
  },
  collapseIcon: {
    visibility: 'hidden',
  },
  path: {
    color: 'red',
  },
  textOverlapMobile: {
    flexWrap: 'nowrap',
  },
  [theme.media.mobile]: {
    poActionIconsWidth: {
      display: 'none',
    },
    nonPoActionIconsWidth: {
      display: 'none',
    },
    innerWrap: {
      display: 'block',
    },
    gridMobile: {
      display: 'flex',
      justifyContent: 'center',
      background: Colors.primaryHighlight,
    },
    rejectButton: {
      borderRadius: 25,
      background: Colors.error,
      color: Colors.gray,
      display: 'inline-flex',
      paddingRight: theme.spacing(2.4),
    },
    approvalButton: {
      borderRadius: 25,
      background: Colors.success,
      color: Colors.gray,
      display: 'inline-flex',
      paddingRight: theme.spacing(2.4),

    },
    nested: {
      borderLeft: 'none',
      marginLeft: 0,
    },
    cursorPointer: {
      marginRight: theme.spacing(1),
    },
    collapseIcon: {
      visibility: 'unset',
    },
    textOverlapMobile: {
      flexWrap: 'wrap',
    },
  },
}));
