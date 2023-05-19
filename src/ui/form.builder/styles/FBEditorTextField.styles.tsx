import { createStyles, makeStyles } from '@material-ui/core';

export const styles = makeStyles(() =>
  createStyles({
    textfield: {
      'height': 40,
      'width': 270,
      '& .MuiOutlinedInput-root': {
        'height': 40,
        'fontWeight': 400,
        'fontSize': 14,
        '&.MuiInputBase-multiline': {
          height: '122px',
        },
      },
    },
    error: {
      '& .Mui-error': {
        fontSize: 11,
        fontFamily: 'Sora',
      },
    },
  }));
