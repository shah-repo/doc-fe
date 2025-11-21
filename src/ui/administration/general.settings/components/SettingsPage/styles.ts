import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';
import { NextTheme } from '../../../../layout/theme-next/provider';
import { SIDEBAR_WIDTH } from '../../constants';

export default makeStyles<NextTheme>(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridGap: theme.spacing(2.5, 3),
    padding: theme.spacing(3, 3, 0),
    gridTemplate: `min-content min-content auto / ${SIDEBAR_WIDTH}px auto`,
  },
  header: {
    gridArea: '1 / 1 / 2 / 3',
    borderBottom: `1px solid ${Colors.stroke}`,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing(2.5),
  },
  title: {
    fontSize: 21,
    color: Colors.textBlack,
  },
  subtitle: {
    color: Colors.textGray,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    whiteSpace: 'nowrap',
    flexWrap: 'wrap',
    gap: theme.spacing(1, 1.25),
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5, 1.25),
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sidebar: {
    gridArea: '2 / 1 / 4 / 2',
    paddingBottom: theme.spacing(3),
  },
  list: {
    padding: 0,
  },
  listItem: {
    borderRadius: 4,
    padding: theme.spacing(1, 1.25),
    marginBottom: theme.spacing(0.5),
    color: Colors.textGray,
    fontSize: 12,
    minHeight: 0,

    '&.Mui-selected': {
      backgroundColor: Colors.primaryBg,
      color: Colors.primaryDark,
      fontWeight: 600,

      '&:hover': {
        backgroundColor: Colors.primaryBg,
      },
    },
    '&:hover': {
      backgroundColor: Colors.primaryBg,
    },
  },
  panels: {
    gridArea: '3 / 2 / 4 / 3',
    overflow: 'auto',
    paddingBottom: theme.spacing(3),
  },
  toggler: {
    gridArea: '2 / 2 / 3 / 3',
  },
  spaceTitle: {
    display: 'none',
  },
  [theme.media.mobile]: {
    header: {
      flexWrap: 'wrap' as const,
      space: 'nowrap',
    },
    actions: {
      flexDirection: 'row-reverse' as const,
    },
    sidebar: {
      display: 'none',
    },
    toggler: {
      display: 'none',
    },
    root: {
      display: 'flow-root',
      overflow: 'scroll',
    },
    spaceTitle: {
      display: 'block',
    },
  },
  drawerAuditLogsPaper: {
    width: '32vw',
    display: 'flex',
    flexDirection: 'column',
  },
  appBarBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: theme.spacing(2, 4),
  },
  groupBox: {
    fontSize: 16,
    boxShadow: `inset 0px 1px 0px -1px ${Colors.lightGray3}, inset 0px -1px 0px 0px ${Colors.lightGray3}`,
    padding: theme.spacing(1.875),
  },
  logEntry: {
    fontSize: 12,
    marginTop: theme.spacing(2),
  },
  auditListItem: {
    margin: '0px',
    padding: '0px',
    marginBottom: '15px',
  },
  auditValue: {
    fontSize: '13px',
    fontFamily: 'Sora',
    wordBreak: 'break-word',
    color: Colors.textBlack,
    lineHeight: 1.5,
  },
  auditKey: {
    fontSize: '12px',
    color: Colors.textGray,
    marginBottom: theme.spacing(0.5),
  },
  owner: {
    color: theme.palette.text.primary,
    fontWeight: 500,
  },
  dateContainer: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.hint,
  },
  revisionContainer: {
    background: Colors.statusDraftBg,
    height: theme.spacing(5),
    paddingTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: theme.spacing(0.4),
  },
  changeType: {
    textTransform: 'lowercase',
    marginLeft: theme.spacing(0.25),
  },
  // title: {
  //   color: theme.palette.primary.main,
  //   fontWeight: theme.typography.fontWeightBold,
  //   marginLeft: theme.spacing(1),
  // },
}));
