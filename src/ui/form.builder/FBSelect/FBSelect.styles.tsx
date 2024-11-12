import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles(() => createStyles({
  select: {
    '& .MuiSelect-root': {
      padding: 10.4,
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
