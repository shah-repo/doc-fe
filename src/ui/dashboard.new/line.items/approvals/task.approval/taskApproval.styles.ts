import { makeStyles } from '@material-ui/core';
import Colors from '../../../../layout/theme-next/colors';
import { grayDotStyles, lineItemStyles } from '../../common/styles';
import { NextTheme } from '../../../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  approvalButton: {
    display: 'none',
  },
  rejectButton: {
    display: 'none',
  },
  innerWrap: {
    display: 'inline-flex',
  },
  gridWeb: {
    display: 'flex',
    justifyContent: 'center',
  },
  viewIconMobile: {
    display: 'block',
  },
  textArlapMobile: {
    flexWrap: 'nowrap',
  },
  [theme.media.mobile]: {
    actionIcons: {
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
    viewIconMobile: {
      display: 'none',
    },
    textArlapMobile: {
      flexWrap: 'wrap',
    },
  },
}));
