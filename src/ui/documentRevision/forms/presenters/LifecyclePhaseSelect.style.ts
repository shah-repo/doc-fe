import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export const styles = makeStyles((theme) => ({
  input: {
    '&.MuiInputBase-root': {
      marginTop: theme.spacing(1.25),
      padding: 0,
    },
    '& .MuiInputBase-input': {
      padding: theme.spacing(1.25),
      fontSize: 14,
    },
  },
  labelProps: {
    marginBottom: theme.spacing(1.25),
    fontWeight: 600,
    fontSize: 12,
    color: Colors.textBlack,
  },
  labelStyle: {
    fontWeight: 600,
    fontSize: 12,
    color: Colors.textBlack,
    marginRight: theme.spacing(1),
  },
  infoIcon: {
    width: 12,
    height: 12,
    color: Colors.primary,
  },
}));
