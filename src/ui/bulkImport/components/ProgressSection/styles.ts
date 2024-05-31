import { LinearProgress, makeStyles, withStyles } from '@material-ui/core';
import { Colors as ColorsNext } from '../../../layout/theme-next';
import Colors from '../../../layout/theme/utils/colors';

export const CustomLinearProgress = withStyles((theme) => ({
  root: {
    marginTop: 5,
    height: 8,
    borderRadius: 4.5,
  },
  colorPrimary: {
    backgroundColor: '#C4C4C4',
  },
  bar: {
    borderRadius: 4.5,
    backgroundColor: '#0DB78D',
  },

}))(LinearProgress);

export default makeStyles(theme => ({
  progressTitle: {
    display: 'flex',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    gap: 10,
    borderRadius: 4,
    background: ColorsNext.tableHeader,
    borderColor: ColorsNext.tableStroke,
    border: '1px solid',
    fontFamily: 'Sora',
    fontSize: 12,
    fontWeight: 600,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'start',
    marginLeft: 10,
    marginRight: 10,
    fontSize: 14,
    fontWeight: 400,
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
    },
  },
  completedText: {
    fontFamily: 'Sora',
    fontWeight: 400,
    fontSize: 12,
  },
  itemTitle: {
    fontFamily: 'Sora',
    fontSize: 14,
    fontWeight: 400,
    textAlign: 'left',
    marginLeft: 5,
  },
  itemIcon: {
    minWidth: 14,
    minHeight: 14,
  },
  checkGreenIcon: {
    width: 15,
    height: 15,
    color: Colors.green_blue,
  },
  watchLaterIcon: {
    width: 15,
    height: 15,
    color: Colors.light_yellow_warning,
  },
  dateContainer: {
    position: 'absolute',
    right: 0,
    top: 20,
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      margin: 'auto',
      marginTop: 20,
    },
  },
  viewModalContainer: {
    position: 'absolute',
    right: 0,
    top: 14,
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      margin: 'auto',
      marginTop: 20,
    },
  },
  itemDate: {
    fontFamily: 'Sora',
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
    paddingTop: 20,
    paddingBottom: 20,
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
  progressBarContainer: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
    },
  },
  progressBarTitle: {
    fontFamily: 'Sora',
    fontSize: 12,
    fontWeight: 600,
    marginRight: 7,
  },
  progressBarText: {
    fontFamily: 'Sora',
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 7,
  },
  statusesContainer: {
    display: 'flex',
    gap: `${theme.spacing(2.5)}px`,
    marginBottom: 10,
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
    fontFamily: 'Sora',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    marginLeft: 5,
  },
  checkIcon: {
    minWidth: 14,
    minHeight: 14,
    color: ColorsNext.primaryLight,
  },
  progressIcon: {
    minWidth: 14,
    minHeight: 14,
    color: ColorsNext.warning,
  },
  warningIcon: {
    minWidth: 14,
    minHeight: 14,
    color: ColorsNext.error,
  },
  blankIcon: {
    minWidth: 14,
    minHeight: 14,
    color: ColorsNext.stroke,
  },
  divider: {
    backgroundColor: '#DDDEE3',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  rejectIcon: {
    cursor: 'pointer',
    color: Colors.latest_red_varient,
    width: 24,
    height: 24,
  },
  rejectIconHover: {
    cursor: 'pointer',
    color: Colors.red,
    width: 24,
    height: 24,
  },
  approveIcon: {
    cursor: 'pointer',
    color: Colors.latest_green_varient,
    width: 24,
    height: 24,
  },
  approveIconHover: {
    cursor: 'pointer',
    color: Colors.green,
    width: 24,
    height: 24,
  },
  approvalsContainer: {
    display: 'flex',
    width: 55,
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 10,
  },
  tableCenterValues: {
    textAlignLast: 'center',
    marginBottom: 20,
  },
  dialogContentContainer: {
    paddingBottom: 20,
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
    color: ColorsNext.primary,
  },
  downloadLogs: {
    minHeight: 30,
    maxHeight: 30,
    maxWidth: 116,
    fontSize: 11,
    paddingRight: 6,
    paddingLeft: 6,
  },
  expandIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
}));
