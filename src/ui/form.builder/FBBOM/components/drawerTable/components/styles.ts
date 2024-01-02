import { makeStyles } from '@material-ui/core';

export const styles = makeStyles((theme) => ({
  infoIcon: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(-1),
    cursor: 'pointer',
  },
  defaultIcon: {
    height: 14,
    width: 14,
  },
}));
