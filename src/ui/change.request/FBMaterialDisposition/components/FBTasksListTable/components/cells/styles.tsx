import { makeStyles } from '@material-ui/core';
import Colors from '../../../../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) => ({
  deleteIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '167px',
  },
  avatar: {
    width: '25px',
    height: '25px',
    fontSize: '12px',
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
    fontSize: '14px',
    lineHeight: '18px',
    color: Colors.almost_black,
  },
  selectedUsersGrid: {
    marginTop: '10px',
    width: 'max-content',
    gap: '13px',
    '&:hover': {
      background: Colors.bright_gray,
      borderRadius: '4px',
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
    minHeight: '30px',
  },
  assigneeActionStatusContainer: {
    display: 'flex',
    fontSize: 12,
  },
  assigneeActionStatus: {
    color: Colors.almost_black,

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
  attachmentName: {
    color: Colors.navy,
    fontSize: 12,
    marginBottom: theme.spacing(1.25),
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
    '& svg:first-child': {
      transform: 'rotate(45deg)',
      height: '0.7em',
      width: '0.7em',
    },
    '& svg:last-child': {
      height: '1em',
      width: '1em',
    },
  },
}));
