import { makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export const styles = makeStyles((theme) => ({
  defaultIcon: {
    height: 14,
    width: 14,
    cursor: 'pointer',
  },
  disabled: {
    color: Colors.gray,
    pointerEvents: 'none',
  },
}));
