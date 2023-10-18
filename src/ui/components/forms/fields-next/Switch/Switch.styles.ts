import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    width: 30,
    height: 20,
    padding: 0,
    borderRadius: 20,
  },
  base: {
    padding: 3,

    '&.Mui-checked': {
      transform: `translateX(${theme.spacing(1)}px)`,
      color: Colors.white,

      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: Colors.primary,
        border: 'none',
      },
    },
  },
  thumb: {
    width: 14,
    height: 14,
    boxShadow: 'none',
  },
  track: {
    borderRadius: theme.spacing(1),
    opacity: 1,
    backgroundColor: Colors.white,
    border: `1px solid ${Colors.primary}`,
    transition: theme.transitions.create(['background-color']),
  },
  checked: {},
}));
