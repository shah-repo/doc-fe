import { makeStyles } from '@material-ui/core';

export const styles = makeStyles((theme) => ({
  defaultIcon: {
    height: 14,
    width: 14,
    cursor: 'pointer',
  },
  preview: {
    marginLeft: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
  },
}));
