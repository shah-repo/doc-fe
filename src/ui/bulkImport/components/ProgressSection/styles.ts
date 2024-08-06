import { LinearProgress, makeStyles, withStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export const CustomLinearProgress = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(0.625),
    height: 8,
    borderRadius: 4.5,
  },
  colorPrimary: {
    backgroundColor: Colors.lightGray2,
  },
  bar: {
    borderRadius: 4.5,
    backgroundColor: Colors.success,
  },

}))(LinearProgress);

export default makeStyles(theme => ({
  progressTitle: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1.25),
    alignItems: 'center',
    gap: theme.spacing(1.25, 1.25),
    borderRadius: 4,
    background: Colors.tableHeader,
    borderColor: Colors.tableStroke,
    border: '1px solid',
    fontSize: 12,
    fontWeight: 600,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'start',
    marginLeft: theme.spacing(1.25),
    marginRight: theme.spacing(1.25),
    fontSize: 14,
    fontWeight: 400,
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
    },
  },
  completedText: {
    fontWeight: 400,
    fontSize: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 400,
    textAlign: 'left',
    marginLeft: theme.spacing(0.625),
  },
  itemIcon: {
    minWidth: 14,
    minHeight: 14,
  },
  checkGreenIcon: {
    width: 14,
    height: 14,
    color: Colors.statusReleased,
  },
  xmarkRedIcon: {
    width: 14,
    height: 14,
    color: Colors.error,
  },
  watchLaterIcon: {
    width: 14,
    height: 14,
    color: Colors.statusReview,
  },
  dateContainer: {
    position: 'absolute',
    right: 0,
    top: theme.spacing(2.5),
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      margin: 'auto',
      marginTop: theme.spacing(2.5),
    },
  },
  viewModalContainer: {
    position: 'absolute',
    right: 0,
    top: 14,
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      margin: 'auto',
      marginTop: theme.spacing(2.5),
    },
  },
  itemDate: {
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 'auto',
    textAlign: 'right',
  },
  itemContainer: {
    display: 'grid',
    position: 'relative',
    gridTemplateColumns: '3fr 6fr 1fr',
    gridTemplateRows: 'repeat(1, 1fr)',
    gridColumnGap: 0,
    gridRowGap: 0,
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    [theme.breakpoints.down('xl')]: {
      gridTemplateColumns: '3fr 5fr 1fr',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  progressBar: {
    width: 200,
  },
  progressBarIconsContainer: {
    minWidth: 450,
    [theme.breakpoints.down('sm')]: {
      minWidth: 250,
    },
  },
  completedMsgContainer: {
    display: 'flex',
    gap: theme.spacing(0.625, 0.625),
    alignItems: 'center',
  },
  progressBarContainer: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
    },
  },
  progressBarTitle: {
    fontSize: 12,
    fontWeight: 600,
    marginRight: theme.spacing(0.875),
  },
  progressBarText: {
    fontSize: 12,
    fontWeight: 400,
    marginLeft: theme.spacing(0.875),
  },
  statusesContainer: {
    display: 'flex',
    gap: theme.spacing(2.5, 2.5),
    marginBottom: theme.spacing(1.25),
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'table',
      margin: 'auto',
    },
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    marginLeft: 5,
  },
  checkIcon: {
    minWidth: 14,
    minHeight: 14,
    color: Colors.primaryLight,
  },
  progressIcon: {
    minWidth: 14,
    minHeight: 14,
    color: Colors.warning,
  },
  warningIcon: {
    minWidth: 14,
    minHeight: 14,
    color: Colors.error,
  },
  blankIcon: {
    minWidth: 14,
    minHeight: 14,
    color: Colors.stroke,
  },
  divider: {
    backgroundColor: '#DDDEE3',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  rejectIcon: {
    cursor: 'pointer',
    color: Colors.statusVoid,
    width: 24,
    height: 24,
    '&:hover': {
      color: Colors.reject,
    },
  },
  approveIcon: {
    cursor: 'pointer',
    color: Colors.statusReleased,
    width: 24,
    height: 24,
    '&:hover': {
      color: Colors.approve,
    },
  },
  approvalsContainer: {
    display: 'flex',
    width: 55,
    justifyContent: 'space-between',
    marginLeft: theme.spacing(1.875),
    marginRight: theme.spacing(1.25),
  },
  tableCenterValues: {
    textAlignLast: 'center',
    marginBottom: theme.spacing(2.5),
  },
  dialogContentContainer: {
    paddingBottom: theme.spacing(2.5),
  },
  dialogTitleContainer: {
    display: 'flex',
  },
  close: {
    marginLeft: 'auto',
  },
  viewButton: {
    minHeight: 30,
    maxHeight: 30,
    color: Colors.primary,
  },
  downloadLogs: {
    minHeight: 30,
    maxHeight: 30,
    maxWidth: 116,
    fontSize: 11,
    paddingRight: theme.spacing(0.75),
    paddingLeft: theme.spacing(0.75),
  },
  expandIcon: {
    width: 12,
    height: 12,
    color: Colors.primary,
  },
}));
