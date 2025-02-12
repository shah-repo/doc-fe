import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../layout/theme-next';

export default makeStyles((theme) => createStyles({
  select: {
    '& .MuiSelect-root': {
      padding: theme.spacing(1.5),
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
