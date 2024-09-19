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
    gridTemplate: 'min-content min-content auto / 800px auto',
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
    alignItems: 'center',
    display: 'flex',
    fontSize: '12px',
    gap: '5px',
    fontWeight: 400,
    paddingBottom: theme.spacing(2.5),
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
  },
  togglerContainer: {
    marginTop: theme.spacing(2.5),
    marginLeft: 0,
  },
}));
