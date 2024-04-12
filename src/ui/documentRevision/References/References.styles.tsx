import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    checkbox: {
      '& .MuiTypography-root': {
        fontFamily: 'Sora',
        fontWeight: 400,
        fontSize: 14,
        color: Colors.almost_black,
      },
      '& .MuiCheckbox-colorSecondary.Mui-checked': {
        color: Colors.navy,
      },
      '& .MuiButtonBase-root': {
        color: Colors.font_gray,
        '&:hover': {
          backgroundColor: Colors.sky_blue,
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
