import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    checkboxHolder: {
      margin: 0,
      '& .MuiTypography-root': {
        fontWeight: 'normal',
        fontSize: 14,
        color: Colors.almost_black,
        paddingLeft: theme.spacing(1.125),
        '& .MuiFormControlLabel-label.Mui-disabled': {
          color: Colors.almost_black,
        },
      },
    },
    generalInfo: {
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '21px',
      color: Colors.almost_black,
    },
    releaseDate: {
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '15px',
      color: Colors.almost_black,
    },
    released: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
      color: Colors.almost_black,
      marginTop: '10px',
    },
  }),
);
