import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from './../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '10%',
      backgroundColor: theme.palette.common.white,
    },
    paper: {
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none',
    },
    logo: {
      margin: '10px 0 100px 0',
    },
    info: {
      width: '700px',
      color: Colors.dark_gray,
    },
  }),
);
