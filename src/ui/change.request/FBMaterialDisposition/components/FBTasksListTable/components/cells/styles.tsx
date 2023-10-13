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
  assigneeAction: {
    display: 'flex',
    marginBottom: theme.spacing(1.25),
    padding: theme.spacing(1, 1.75),
    minHeight: '30px',
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
}));
