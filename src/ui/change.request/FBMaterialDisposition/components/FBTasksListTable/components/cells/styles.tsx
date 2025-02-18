import { makeStyles } from '@material-ui/core';
import Colors from '../../../../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) => ({
  deleteIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: 167,
  },
  avatar: {
    width: 25,
    height: 25,
    fontSize: 12,
    fontWeight: 600,
    color: Colors.white,
    fontFamily: 'Sora',
    textTransform: 'uppercase',
    marginRight: theme.spacing(0.875),
  },
  userName: {
    fontFamily: 'Sora',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: '18px',
    color: Colors.almost_black,
  },
  selectedUsersGrid: {
    marginTop: theme.spacing(1.25),
    width: 'max-content',
    gap: '13px',
    '&:hover': {
      background: Colors.bright_gray,
      borderRadius: theme.spacing(0.5),
    },
  },
  commentCell: {
    display: 'flex',
    marginBottom: theme.spacing(1.25),
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  employeeResponseFields: {
    marginBottom: theme.spacing(1.25),
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  assigneeAction: {
    display: 'flex',
    padding: theme.spacing(1, 1.75),
    minHeight: 30,
  },
  assigneeActionStatusContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
  },
  assigneeActionStatus: {
    color: Colors.almost_black,
    fontSize: 12,
    fontWeight: 700,
    marginLeft: theme.spacing(0.625),
  },
  assigneeActionStatusDate: {
    color: Colors.font_gray,

    fontWeight: 400,
    marginLeft: theme.spacing(0.5),
    wordWrap: 'break-word',
  },
  uploadEvidenceField: {
    height: 20,
    padding: theme.spacing(0.625, 1.25),
    marginBottom: theme.spacing(1.25),
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  uploadEvidenceFieldIcon: {
    transform: 'rotate(45deg)',
    height: '0.7em',
    width: '0.7em',
  },
  uploadEvidenceFieldLabel: {
    fontSize: 12,
    fontWeight: 400,
    marginLeft: theme.spacing(0.75),
  },
  pendingIcon: {
    width: 14,
    height: 14,
    borderRadius: 3,
    color: Colors.light_yellow_warning,
  },
  truncate: {
    fontFamily: 'Sora',
    fontWeight: 400,
    fontSize: 14,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'pre-line',
    display: '-webkit-box',
    '-webkit-line-clamp': 4,
    'line-clamp': 4,
    '-webkit-box-orient': 'vertical',
  },
  tooltipBox: {
    maxHeight: '200px !important',
    maxWidth: '425px !important',
    overflow: 'auto',
    padding: theme.spacing(0.25),
    fontSize: 12,
    whiteSpace: 'pre-line',
  },
  attachmentsContainer: {
    color: Colors.navy,
    fontSize: 12,
    marginBottom: theme.spacing(1.25),
    overflow: 'auto',
    maxHeight: 105,
    width: 'fit-content',
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  attachmentName: {
    display: 'flex',
    overflow: 'hidden',
  },
  attachmentIcon: {
    width: 14,
    height: 14,
  },
  attchmentNameWrapper: {
    overflow: 'hidden',
    margin: theme.spacing(0, 0.75),
  },
  redLine: {
    color: Colors.latest_red_varient,
    borderBottom: `1px solid ${Colors.latest_red_varient}`,
  },
}));
