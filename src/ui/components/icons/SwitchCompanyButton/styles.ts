import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';
import { NextTheme } from '../../../layout/theme-next/provider';

export default makeStyles((theme: NextTheme) => ({
  text: {
    fontSize: 14,
    fontWeight: 400,
    color: Colors.textBlack,
  },
  [theme.media.mobile]: {
    text: {
      color: Colors.textGray,
    },
  },
}));
