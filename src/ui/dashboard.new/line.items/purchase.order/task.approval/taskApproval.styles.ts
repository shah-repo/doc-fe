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
  approvalButton: {
    display: 'none',
  },
  innerWrap: {
    display: 'inline-flex',
  },
  rejectButton: {
    display: 'none',
  },
  gridWeb: {
    display: 'flex',
    justifyContent: 'center',
    background: Colors.primaryHighlight,
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
  downloadMobile: {
    display: 'none',
  },
  pdfActionIcon: {
    paddingLeft: 0,
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
    downloadMobile: {
      borderRadius: 25,
      background: Colors.textGray,
      color: Colors.white,
      display: 'inline-flex',
      padding: `${theme.spacing(1.5)}px ${theme.spacing(3)}px`,
    },
  },
}));
