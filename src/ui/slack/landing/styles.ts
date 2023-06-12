import { createStyles, makeStyles, Theme } from '@material-ui/core';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    presenter: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 9999,
      backgroundColor: theme.palette.common.white,
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none',
    },
    alignCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  }),
);
