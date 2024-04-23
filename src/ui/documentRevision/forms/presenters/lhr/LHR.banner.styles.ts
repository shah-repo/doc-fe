import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => createStyles({
  container: {
    flexWrap: 'nowrap',
    alignItems: 'center',
    margin: theme.spacing(1.25, 3.5, 2),
    fontWeight: 600,
    fontSize: 19,
    lineHeight: 1.25,
    color: Colors.textBlack,
  },
  dot: {
    width: 4,
    height: 4,
    margin: theme.spacing(0, 1),
    background: Colors.textBlack,
  },
  link: {
    color: Colors.textBlack,
    cursor: 'pointer',
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));
