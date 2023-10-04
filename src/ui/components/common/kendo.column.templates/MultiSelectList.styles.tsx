import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../ui/layout/theme-next';

export default makeStyles((theme) => ({
  chip: {
    borderRadius: 2,
    background: Colors.primaryBg,
    fontSize: 14,
    lineHeight: 1.3,
    color: Colors.primary,
    cursor: 'pointer',
    marginRight: theme.spacing(1),
  },
}));
