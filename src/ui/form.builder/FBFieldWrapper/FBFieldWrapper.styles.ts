import { fade, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles(theme => ({
  root: {
    position: 'relative',

    '.fb-sortable-ghost &': {
      opacity: 0,
    },
  },
  field: {
    position: 'relative',

    '.fb-sortable-ghost &': {
      maxHeight: '10vh',
      overflow: 'hidden',
    },
    '.fb-sortable-drag &': {
      maxHeight: '10vh',
      overflow: 'hidden',

      '&:after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 20,
        background: `linear-gradient(0deg, ${Colors.background} 0%, ${fade(Colors.background, 0)} 100%)`,
      },
    },
  },
  tools: {
    position: 'absolute',
    inset: theme.spacing(-1, -1, -1, -1),
    borderRadius: theme.shape.borderRadius,
    borderTopRightRadius: 0,
    outline: `2px solid ${Colors.primaryLight}`,
    outlineOffset: -2,

    '.fb-sortable-drag &': {
      backgroundColor: Colors.background,
      boxShadow: theme.shadows[2],
    },
  },
}));
