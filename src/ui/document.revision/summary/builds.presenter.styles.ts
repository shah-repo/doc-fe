import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme) =>
  createStyles({
    chip: {
      'border': `1px solid ${Colors.medium_blue}`,
      'borderRadius': '3px',
      'background': Colors.light_blue,
      '&:hover': {
        cursor: 'pointer',
      },
      'marginTop': theme.spacing(2),
    },
    link: {
      'textDecoration': 'none',
      'marginRight': '8px',
      '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    labelProps: {
      marginBottom: 0,
      fontWeight: 600,
      fontSize: 12,
      color: Colors.almost_black,
    },
    labelFont: {
      fontSize: 14,
      color: Colors.font_gray,
    },
    styleFont: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.5,
      color: Colors.navy,
    },
  }));

