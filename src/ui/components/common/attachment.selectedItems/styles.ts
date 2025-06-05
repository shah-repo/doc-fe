import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme-next/colors';

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  clearSelectionButton: {
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  clearSelectionIcon: {
    height: 12,
    width: 12,
  },
  aiButton: {
    marginLeft: theme.spacing(1.5),
    padding: theme.spacing(0.5),
    background: `linear-gradient(226.32deg, ${Colors.secondary} 17.49%, ${Colors.primaryGradient} 44.44%, ${Colors.primary} 93.06%)`,
  },
  aiIcon: {
    color: Colors.white,
    height: 12,
    width: 12,
  },
  hr: {
    margin: theme.spacing(0, 0, 0, 1.5),
    height: 17,
  },
  attachmentCount: {
    color: Colors.primary,
    fontWeight: 700,
  },
}));
