import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
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
    gap: `${theme.spacing(1, 1.25)}px`,
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    gap: `${theme.spacing(0.5, 1.25)}px`,
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
}));
