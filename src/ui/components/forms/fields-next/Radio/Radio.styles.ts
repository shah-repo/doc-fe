import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles(theme => ({
  icon: {
    borderRadius: 18,
    width: 18,
    height: 18,
    border: `2px solid ${Colors.textBlack}`,
    backgroundColor: Colors.white,
    color: Colors.whiteDimmed,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',

    '&:before': {
      content: '""',
      display: 'block',
      borderRadius: 8,
      width: 8,
      height: 8,
      backgroundColor: Colors.primary,
      transform: 'scale(0)',
      transition: theme.transitions.create('transform', { duration: 100 }),
    },

    '$root.Mui-focusVisible &': {
      backgroundColor: Colors.gray,
    },
    'input:hover ~ &': {
      backgroundColor: Colors.gray,
    },
    'input:disabled ~ &': {
      backgroundColor: Colors.hover,
      borderColor: Colors.buttonDisabled,

      '&:before': {
        backgroundColor: Colors.buttonDisabled,
      },
    },
  },
  checkedIcon: {
    borderColor: Colors.primary,

    '&:before': {
      transform: 'scale(1)',
    },
  },
}));
