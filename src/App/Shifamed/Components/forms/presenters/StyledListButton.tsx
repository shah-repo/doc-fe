import { Button, withStyles } from '@material-ui/core';
import { Colors } from '../../../../../ui/layout/theme-next';

const styles = () => ({
  root: {
    margin: 0,
    '&:hover': {
      backgroundColor: 'unset',
    },
    '&.Mui-disabled $label': {
      color: Colors.textDisabled,
    },
  },
  label: {
    padding: '10.5px 20px',
    fontFamily: 'Sora',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    backgroundColor: Colors.white,
    color: Colors.primary,
    borderRadius: '100px',
    minWidth: '72px',
  },
});

export const StyledButton = withStyles(styles)(Button);
