import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) => createStyles({
  select: {
    '& .MuiSelect-select': {
      padding: theme.spacing(1.5),
      display: 'flex',
      alignItems: 'center',
      minHeight: 40,
      boxSizing: 'border-box',
    },
  },
  menu: {
    '& .MuiListItem-root': {
      minHeight: 32,
    },
  },
  placeholderItem: {
    '&.Mui-selected': {
      backgroundColor: 'unset',
    },
    color: Colors.textDisabled,
  },
}));
