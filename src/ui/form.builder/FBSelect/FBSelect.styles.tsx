import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) => createStyles({
  select: {
    '& .MuiSelect-root': {
      padding: theme.spacing(1.3),
    },
  },
  placeholderValue: {
    '& .MuiSelect-select': {
      color: Colors.textDisabled,
    },
  },
  placeholderItem: {
    '&.Mui-selected': {
      backgroundColor: 'unset',
    },
    color: Colors.textDisabled,
  },
}));
