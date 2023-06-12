import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  '@keyframes arrowOut': {
    '0': { transform: 'translate(0, 0)' },
    '30%': { transform: 'translate(-12.5%, 12.5%)' },
    '70%': { transform: 'translate(12.5%, -12.5%)' },
    '100%': { transform: 'translate(0, 0)' },
  },
  'root': {
    ...theme.typography.body2,
    'display': 'flex',
    'alignItems': 'center',
    'color': theme.palette.primary.light,
    'marginTop': theme.spacing(.5),
    'textDecoration': 'none',
    '&:hover': {
      color: theme.palette.primary.main,
    },
    '&:hover $arrow': {
      animationName: '$arrowOut',
    },
  },
  'icon': {
    marginLeft: theme.spacing(.5),
    position: 'relative',
  },
  'arrow': {
    position: 'absolute',
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  'outer': {
    display: 'block',
  },
}));
