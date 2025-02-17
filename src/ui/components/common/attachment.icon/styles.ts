import { createStyles, makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export const useStyles = makeStyles((theme) => createStyles({
  starIcon: {
    color: Colors.primary,
    height: 16,
    width: 16,
    marginRight: theme.spacing(2),
  },
}));
