import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles((theme) => ({
  container: {
    width: '90%',
    backgroundColor: Colors.errorHighlight,
    border: `1px solid ${Colors.error}`,
    borderRadius: 4,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBlock: {
    fontSize: 14,
    color: Colors.textBlack,
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  errorIcon: {
    paddingLeft: theme.spacing(1),
    flexShrink: 0,
    color: Colors.error,
  },
}));
