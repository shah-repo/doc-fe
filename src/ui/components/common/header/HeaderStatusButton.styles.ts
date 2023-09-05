import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  button: {
    borderRadius: theme.shape.borderRadius / 2,
    padding: theme.spacing(0, 1.5),
    color: `${Colors.textBlack} !important`,
    marginRight: theme.spacing(1),
  },
  buttonIcon: {
    height: 36,
    fontSize: 10,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1.25),
    marginLeft: theme.spacing(0.5),
    borderLeft: `1px solid ${Colors.stroke}`,
    color: Colors.primary,

    '& svg:first-child': {
      fontSize: 12,
    },
  },
}));
