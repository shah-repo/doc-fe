import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';
import { NextTheme } from '../../../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridGap: theme.spacing(2.5, 3),
    padding: theme.spacing(3, 3, 0),
    gridTemplate: 'min-content min-content auto / 850px auto',
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
    gap: '5px',
  },
  title: {
    fontSize: 21,
    color: Colors.textBlack,
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
  },
  subtitle: {
    color: Colors.textGray,
  },
  description: {
    display: 'flex',
    backgroundColor: Colors.primaryBg,
    borderRadius: theme.spacing(1),
    fontSize: '12px',
    gap: '8px',
    fontWeight: 400,
    padding: theme.spacing(1.5, 1.5, 1.5),
    marginBottom: theme.spacing(2.5),
  },
  descriptionIcon: {
    paddingTop: theme.spacing(0.3),
    color: Colors.primaryLight,
  },
  togglerBox: {
    padding: theme.spacing(2.5, 2.5, 2.5),
    border: `1px solid ${Colors.stroke}`,
    borderRadius: '10px',
  },
  togglerText: {
    color: Colors.primary,
    fontWeight: 600,
    fontSize: '16px',
  },
  togglerDescription: {
    color: Colors.textGray,
    marginTop: theme.spacing(0.5),
    fontSize: '12px',
  },
  togglerContainer: {
    marginTop: theme.spacing(2.5),
    marginLeft: theme.spacing(2.5),
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
