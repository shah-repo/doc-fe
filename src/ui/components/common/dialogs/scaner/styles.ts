import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    width: '60vw',
  },
  contentWrapper: {
    width: '100%',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  key: {
    width: 200,
    fontSize: 14,
    color: Colors.textBlack,
  },
  value: {
    fontSize: 14,
    color: Colors.textGray,
  },
  infoIcon: {
    width: 16,
    height: 16,
    color: Colors.primaryLight,
  },
  infoContainer: {
    backgroundColor: Colors.primaryHighlight,
    color: Colors.black,
    border: `1px solid ${Colors.primaryLight}`,
    borderRadius: theme.spacing(0.5),
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    margin: `${theme.spacing(2.5)}px 0px`,
    padding: theme.spacing(1),
  },
}));
