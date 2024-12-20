import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';
import { NextTheme } from '../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) => createStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridGap: theme.spacing(2.5, 3),
    padding: theme.spacing(3, 3, 0),
    gridTemplate: 'min-content min-content auto / minmax(auto, 850px) auto',
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
  header: {
    gridArea: '1 / 1 / 2 / 3',
    borderBottom: `1px solid ${Colors.stroke}`,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(0.5, 0.5),
  },
  title: {
    fontSize: 21,
    color: Colors.textBlack,
    display: 'flex',
    gap: theme.spacing(0.5, 0.5),
    alignItems: 'center',
  },
  subtitle: {
    color: Colors.textGray,
  },
  description: {
    display: 'flex',
    backgroundColor: Colors.primaryBg,
    borderRadius: theme.spacing(1),
    fontSize: 12,
    gap: theme.spacing(1, 1),
    fontWeight: 400,
    padding: theme.spacing(1.5, 1.5, 1.5),
    marginBottom: theme.spacing(2.5),
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  infoIcon: {
    color: Colors.primaryLight,
    fontSize: 20,
  },
  subscriptionsList: {
    padding: theme.spacing(2.5, 2.5, 1.5),
    border: `1px solid ${Colors.stroke}`,
    borderRadius: '10px',
  },
  panelTitle: {
    color: Colors.primary,
    fontWeight: 600,
    fontSize: 16,
    marginBottom: theme.spacing(0.5),
  },
  subscriptionInfo: {
    lineHeight: 1,
  },
  subscriptionTitle: {
    color: Colors.textBlack,
    marginBottom: theme.spacing(0.25),
    fontWeight: 600,
    fontSize: 14,
  },
  subscriptionDescription: {
    color: Colors.textGray,
    fontSize: 12,
  },
  togglerContainer: {
    padding: theme.spacing(1.25, 0),
    alignItems: 'center',
    borderBottom: `1px solid ${Colors.stroke}`,

    '&:last-child': {
      borderBottom: 'none',
    },
  },
  descriptionIcon: {
    color: Colors.primaryLight,
    marginTop: theme.spacing(0.25),
  },
  togglerLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
  },
  [theme.media.mobile]: {
    header: {
      flexWrap: 'wrap',
      space: 'nowrap',
    },
    root: {
      display: 'flow-root',
      overflow: 'scroll',
    },
    description: {
      display: 'block',
      paddingTop: theme.spacing(2.5),
    },
    togglerContainer: {
      marginTop: theme.spacing(2.5),
      marginLeft: 0,
      display: 'flex',
      alignItems: 'center',
    },
  },
  togglerIcon: {
    color: Colors.primaryLight,
    marginLeft: theme.spacing(1),
    fontSize: '20px',
  },
  dialogIcon: {
    color: Colors.primaryLight,
  },
  descriptionPlaceholder: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '15px',
    color: Colors.textGray,
    marginTop: theme.spacing(0.5),
  },
}));
